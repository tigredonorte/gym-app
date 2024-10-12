import { EmailService } from '@gym-app/shared/api';
import { IRequestUserDataDto, IUserDto, UserReturnType } from '@gym-app/user/types';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { sendChangeEmailCode } from './emails/sendChangeEmailCode';
import { sendChangeEmailReverted } from './emails/sendChangeEmailReverted';
import { sendChangePasswordCode } from './emails/sendChangePasswordCode';
import { sendEmailChanged } from './emails/sendEmailChanged';
import { sendPasswordChanged } from './emails/sendPasswordChanged';
import { getUserAccessData } from './request-info-middleware';
import { UserEventsService } from './user-events.service';
import { IChangePassword, IUpdateEmail } from './user.dto';
import { User, UserDocument } from './user.model';
import _ = require('lodash');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userEventService: UserEventsService,
    private emailService: EmailService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async decryptPassword(password: string, hash: string): Promise<boolean> {
    try {
      const result = await argon2.verify(hash, password);
      return result;
    } catch (error) {
      return false;
    }
  }

  async create(userData: Partial<User>): Promise<UserReturnType> {
    try {
      if (userData?.password) {
        userData.password = await this.hashPassword(userData.password);
      }

      const createdUser = new this.userModel(userData);
      await createdUser.save();
      const user = this.getUserReturnData(createdUser) as UserReturnType;
      this.userEventService.emitUserCreated(user);
      return user;
    } catch (error) {
      if (_.get(error, 'code') === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserReturnType> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.userAvatar = avatarUrl;
    await user.save();

    return this.getUserReturnData(user) as UserReturnType;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return !!user;
  }

  async findByEmailAndPassword(email: string, password: string): Promise<UserReturnType | null> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (!user) {
      const emailChanged = await this.userModel.findOne({ 'emailHistory.oldEmail': email }).select('+emailHistory').exec();
      if (emailChanged) {
        const changeDate = emailChanged.emailHistory?.find((emailHistoryItem) => email === emailHistoryItem.email)?.createdAt;
        throw new BadRequestException({ message: 'Email recently changed', changeDate });
      }
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await this.decryptPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect email or password');
    }

    return this.getUserReturnData(user) as UserReturnType;
  }

  private getRecoverCode(): { code: string, expiresAt: Date, createdAt: Date } {
    const recoverCode = this.getRandomString();
    const expiresAt = new Date(new Date().getTime() + 30*60000); // 30 minutes from now

    return {
      code: recoverCode,
      expiresAt: expiresAt,
      createdAt: new Date(),
    };
  }

  async createRecoverCode(email: string): Promise<{ recoverCode: string }> {
    const user = await this.userModel.findOne({ email }).select('+recoverCode').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoverCode = this.getRecoverCode();
    const code = await this.hashPassword(recoverCode.code);
    user.recoverCode = {
      ...recoverCode,
      code,
    };
    await user.save();

    return {
      recoverCode: recoverCode.code,
    };
  }

  async checkRecoverCode(email: string, code: string): Promise<false | string> {
    const user = await this.userModel.findOne({
      email,
      'recoverCode.expiresAt': { $gt: new Date() }
    }).select('+recoverCode').exec();

    if (!user?.recoverCode?.code) {
      console.error('No recover code found');
      return false;
    }

    const isSameCode = await this.decryptPassword(code, user.recoverCode.code);
    if (!isSameCode) {
      console.error('Failure to decrypt code');
      return false;
    }

    const recoverCode = this.getRecoverCode();
    const changePasswordCode = await this.hashPassword(recoverCode.code);
    user.recoverCode = {
      code: undefined,
      expiresAt: recoverCode.expiresAt,
      createdAt: recoverCode.createdAt,
      changePasswordCode,
    };
    await user.save();

    return recoverCode.code;
  }

  async changePasswordStart(id: string, { newPassword, oldPassword, confirmPassword }: IChangePassword, userData: IRequestUserDataDto): Promise<IUserDto['passwordHistory']> {
    const user = await this.userModel.findById(id).select('+password').select('+passwordHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await this.decryptPassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect password');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    if (newPassword === oldPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const code = this.getRandomString();
    const hashedCode = await this.hashPassword(code);
    user.passwordHistory = [
      ...(user?.passwordHistory || []),
      {
        password: hashedPassword,
        createdAt: new Date(),
        expiresAt: new Date(new Date().getTime() + 30*60000), // 30 minutes from now
        code: hashedCode,
        confirmed: false,
        ip: userData.ip || '',
      }
    ];

    await this.emailService.sendRenderedEmail(sendChangePasswordCode(user.email, {
      ...getUserAccessData(userData),
      changePasswordLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/change-password/${id}/${code}`,
    }));
    await user.save();
    return this.getUserReturnData({ passwordHistory: user.passwordHistory }) as IUserDto['passwordHistory'];
  }

  async changePasswordComplete(id: string, code: string, userData: IRequestUserDataDto): Promise<void> {
    const user = await this.userModel.findById(id).select('+passwordHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordHistory) {
      throw new BadRequestException('Invalid change password code');
    }

    const passwordHistoryItemIndex = user.passwordHistory
      .findIndex(
        async (item) => {
          if (item.expiresAt < new Date() || !item.code || item.confirmed) {
            return false;
          }
          return await this.decryptPassword(code, `${item.code}`);
        }
      );

    if (_.isNil(passwordHistoryItemIndex) || passwordHistoryItemIndex === -1) {
      throw new BadRequestException('Invalid change password code');
    }

    if (user.passwordHistory[passwordHistoryItemIndex].confirmed) {
      throw new BadRequestException('Password is already confirmed');
    }

    if (!user.passwordHistory[passwordHistoryItemIndex].password) {
      throw new BadRequestException('Password history entry not found');
    }

    user.password = user.passwordHistory[passwordHistoryItemIndex].password;
    user.passwordHistory[passwordHistoryItemIndex].confirmed = true;
    user.markModified('passwordHistory');

    await user.save();
    this.userEventService.emitUserEdited(this.getUserReturnData(user) as UserReturnType);
    await this.emailService.sendRenderedEmail(sendPasswordChanged(user.email, {
      recoverLink: `${process.env['FRONTEND_URL']}/auth/forgot-password?email=${user.email}`,
      ...getUserAccessData(userData),
    }));
  }

  async deleteChangePassword(userId: string) {
    const user = await this.userModel.findById(userId).select('+passwordHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.passwordHistory = user.passwordHistory?.filter((item) => item.confirmed || new Date(item.expiresAt) < new Date());
    await user.save();
  }

  async changePassword(email: string, password: string, token: string, ip: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      email,
      'recoverCode.expiresAt': { $gt: new Date() }
    }).select('+passwordHistory').select('+recoverCode').exec();

    if (!user?.recoverCode?.changePasswordCode) {
      console.error('No recover code found');
      return false;
    }

    const isSameCode = await this.decryptPassword(token, user.recoverCode.changePasswordCode);
    if (!isSameCode) {
      console.error('Failure to decrypt code' + token);
      return false;
    }

    const hashedPassword = await this.hashPassword(password);
    user.passwordHistory = [
      {
        password: hashedPassword,
        createdAt: new Date(),
        expiresAt: new Date(),
        code: undefined,
        confirmed: true,
        ip,
      },
      ...(user?.passwordHistory || []),
    ];
    user.password = hashedPassword;
    user.recoverCode = undefined;
    await user.save();

    this.userEventService.emitPasswordChanged(user.id);
    return true;
  }

  async findByEmail(email: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      return null;
    }

    const result = user;
    result.id = user._id.toString();
    return this.getUserReturnData(result) as UserReturnType;
  }

  async findByHistoryEmail(email: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findOne({ 'emailHistory.email': email }).lean().exec();
    return this.getUserReturnData(user) as UserReturnType;
  }

  async findById(id: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findById(id).lean().exec();
    return this.getUserReturnData(user) as UserReturnType;
  }

  async getUserProfile(id: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findById(id).select('+emailHistory').select('+passwordHistory').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.getUserReturnData(user) as UserReturnType;
  }

  public async updateUser(id: string, data: Partial<Omit<User, 'password' | 'recoverCode' | 'email'>>): Promise<UserReturnType> {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    const result = this.getUserReturnData(user);
    if (!result) {
      throw new NotFoundException('User not found');
    }

    this.userEventService.emitUserEdited(result);
    return result as UserReturnType;
  }

  public async updateEmail(id: string, { newEmail, oldEmail }: IUpdateEmail, userData: IRequestUserDataDto): Promise<IUserDto['emailHistory']> {
    const user = await this.userModel.findById(id).select('+emailHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (oldEmail !== user.email) {
      throw new BadRequestException('Old email is incorrect');
    }

    const emailExists = await this.emailExists(newEmail);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    user.emailHistory = this.addEmailToHistory(user.emailHistory, newEmail, oldEmail);
    await user.save();

    this.userEventService.emitUserEdited(this.getUserReturnData(user) as UserReturnType);
    await this.emailService.sendRenderedEmail(sendChangeEmailCode(oldEmail, {
      ...getUserAccessData(userData),
      changeEmailLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/change-email/${id}/${user.emailHistory[user.emailHistory.length - 1].changeEmailCode}`,
      changePasswordLink: `${process.env['FRONTEND_URL']}/profile/change-password/${id}`
    }));
    return user.emailHistory;
  }

  async confirmChangeEmail(id: string, changeEmailCode: string, userData: IRequestUserDataDto): Promise<{ message: string, title: string }> {
    const user = await this.userModel.findById(id).select('+emailHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailHistoryItemIndex = user.emailHistory?.findIndex((emailHistoryItem) => changeEmailCode === emailHistoryItem.changeEmailCode);
    if (!emailHistoryItemIndex || emailHistoryItemIndex === -1) {
      throw new BadRequestException('Invalid change email code');
    }

    if (user.emailHistory?.[emailHistoryItemIndex].revertChangeEmailCode) {
      throw new BadRequestException('Email is already confirmed');
    }

    if(user.emailHistory?.[emailHistoryItemIndex].email === user.email) {
      throw new BadRequestException('Email is already changed');
    }

    if (!user.emailHistory?.[emailHistoryItemIndex].email) {
      throw new BadRequestException('Email history entry not found');
    }

    const revertChangeEmailCode = this.getRandomString();
    await this.emailService.sendRenderedEmail(sendEmailChanged(user.email, {
      ...getUserAccessData(userData),
      revertChangeEmailLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/revert-change-email/${id}/${revertChangeEmailCode}`,
    }));

    user.email = user.emailHistory?.[emailHistoryItemIndex].email;
    user.emailHistory[emailHistoryItemIndex] = {
      ...user.emailHistory[emailHistoryItemIndex],
      revertChangeEmailCode,
      confirmed: true,
    };
    user.confirmed = true;

    await user.save();

    this.userEventService.emitUserEdited(this.getUserReturnData(user) as UserReturnType);
    return {
      title: 'Email changed',
      message: 'Email changed successfully. Please check your email to revert the change if you did not request this change.',
    };
  }

  getRandomString(length = 12): string {
    const base64String = crypto.randomBytes(length).toString('base64');
    const urlSafeBase64 = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeBase64;
  }

  async deleteChangeEmail(id: string, changeEmailCode: string): Promise<void> {
    const user = await this.userModel.findById(id).select('+emailHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailHistoryItemIndex = user.emailHistory?.findIndex((emailHistoryItem) => changeEmailCode === emailHistoryItem.changeEmailCode);
    if (emailHistoryItemIndex === undefined || emailHistoryItemIndex === null || emailHistoryItemIndex === -1) {
      throw new BadRequestException('Invalid change email code');
    }

    if (user.emailHistory?.[emailHistoryItemIndex]?.email === user.email) {
      throw new BadRequestException('Email is already confirmed');
    }

    user.emailHistory = user.emailHistory?.filter((emailHistoryItem) => changeEmailCode !== emailHistoryItem.changeEmailCode);
    await user.save();
    this.userEventService.emitUserEdited(this.getUserReturnData(user) as UserReturnType);
  }

  async revertChangeEmail(id: string, revertChangeEmailCode: string): Promise<void> {
    const user = await this.userModel.findById(id).select('+emailHistory').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailHistoryItemIndex = user.emailHistory?.findIndex((emailHistoryItem) => revertChangeEmailCode === emailHistoryItem.revertChangeEmailCode);
    if (!emailHistoryItemIndex || emailHistoryItemIndex === -1) {
      throw new BadRequestException('Invalid revert change email code');
    }

    if (user.emailHistory?.[emailHistoryItemIndex].oldEmail === user.email) {
      throw new BadRequestException('Email is already reverted');
    }

    if (!user.emailHistory?.[emailHistoryItemIndex].oldEmail) {
      throw new BadRequestException('Old email not found');
    }

    await this.emailService.sendRenderedEmail(sendChangeEmailReverted(user.email, {}));
    user.email = user.emailHistory?.[emailHistoryItemIndex].oldEmail;
    user.emailHistory = user.emailHistory?.filter((emailHistoryItem) => emailHistoryItem.email !== user.email);

    await user.save();
    this.userEventService.emitUserEdited(this.getUserReturnData(user) as UserReturnType);
  }

  private addEmailToHistory(emailHistory: UserDocument['emailHistory'], newEmail: string, oldEmail: string) {
    emailHistory = !emailHistory ? [
      {
        email: oldEmail,
        oldEmail: '',
        createdAt: new Date(),
        confirmed: false,
      }
    ] : emailHistory.filter((emailHistoryItem) => emailHistoryItem.email !== newEmail);

    const changeEmailCode = this.getRandomString();
    emailHistory.push({
      email: newEmail,
      oldEmail,
      createdAt: new Date(),
      confirmed: false,
      changeEmailCode,
    });
    return emailHistory;
  }

  private getUserReturnData(user: Partial<UserDocument> | null): Partial<UserReturnType> | null {
    if (!user) {
      return null;
    }

    if (user.toObject) {
      user = user.toObject();
    }

    if (user.passwordHistory) {
      user.passwordHistory = user.passwordHistory.map((passwordHistoryItem) => _.omit(passwordHistoryItem, ['code', 'password']));
    }
    if (user._id) {
      user.id = user._id.toString();
    }
    return _.omit(user, ['password', '__v', '_id']);
  }
}
