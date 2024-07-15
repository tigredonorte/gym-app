import { EmailService } from '@gym-app/email';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { sendChangeEmailCode } from './emails/sendChangeEmailCode';
import { sendChangeEmailReverted } from './emails/sendChangeEmailReverted';
import { sendEmailChanged } from './emails/sendEmailChanged';
import { IRequestInfo, getUserAccessData } from './request-info-middleware';
import { UserEventsService } from './user-events.service';
import { IUpdateEmail } from './user.dto';
import { User, UserDocument } from './user.model';
import _ = require('lodash');

export type UserReturnType = Omit<User, 'password'> & { id?: string };

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userEventService: UserEventsService,
    private emailService: EmailService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const pass = await bcrypt.hash(password, salt);
    return pass;
  }

  private async decryptPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
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
      const plain = createdUser.toObject();
      plain.id = createdUser._id.toString();
      delete plain._id;
      const plainUser = _.omit(plain, ['password', '__v']);
      this.userEventService.emitUserCreated({
        name: plainUser.name,
        email: plainUser.email,
        id: plainUser.id,
      });
      return plainUser;
    } catch (error) {
      if (_.get(error, 'code') === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
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

    const result = user.toObject();
    result.id = user._id.toString();
    return _.omit(result, ['password', '__v', '_id']);
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

  async createRecoverCode(email: string): Promise<{ recoverCode: string, exists: boolean }> {
    const user = await this.userModel.findOne({ email }).select('+recoverCode').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.recoverCode && user.recoverCode.code && user.recoverCode.expiresAt > new Date()) {
      return {
        recoverCode: user.recoverCode.code,
        exists: true
      };
    }

    const recoverCode = this.getRecoverCode();
    user.recoverCode = recoverCode;
    await user.save();

    return {
      recoverCode: recoverCode.code,
      exists: false
    };
  }

  async checkRecoverCode(email: string, code: string): Promise<false | string> {
    const user = await this.userModel.findOne({
      email,
      'recoverCode.code': code,
      'recoverCode.expiresAt': { $gt: new Date() }
    }).exec();

    if (!user) {
      return false;
    }

    const recoverCode = this.getRecoverCode();
    user.recoverCode = {
      code: undefined,
      expiresAt: recoverCode.expiresAt,
      createdAt: recoverCode.createdAt,
      changePasswordCode: recoverCode.code
    };
    await user.save();

    return recoverCode.code;
  }

  async changePassword(email: string, password: string, token: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      email,
      'recoverCode.changePasswordCode': token,
      'recoverCode.expiresAt': { $gt: new Date() }
    }).exec();

    if (!user) {
      return false;
    }

    user.password = await this.hashPassword(password);
    user.recoverCode = undefined;
    await user.save();

    return true;
  }

  async findByEmail(email: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();

    if (!user) {
      return null;
    }

    const result = user;
    result.id = user._id.toString();
    return _.omit(result, ['password', '__v', '_id']);
  }

  async findById(id: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findById(id).lean().exec();
    return this.getUserReturnData(user);
  }

  async getUserProfile(id: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findById(id).select('+emailHistory').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.getUserReturnData(user);
  }

  public async updateUser(id: string, data: Partial<Omit<User, 'password' | 'recoverCode' | 'email'>>): Promise<UserReturnType> {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    const result = this.getUserReturnData(user);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  public async updateEmail(id: string, { newEmail, oldEmail }: IUpdateEmail, userData: IRequestInfo['userData']): Promise<void> {
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
    await this.emailService.sendRenderedEmail(sendChangeEmailCode(oldEmail, {
      ...getUserAccessData(userData),
      changeEmailLink: `${process.env['FRONTEND_URL']}/user/confirm?url=user/change-email/${id}/${user.emailHistory[user.emailHistory.length - 1].changeEmailCode}`,
      changePasswordLink: `${process.env['FRONTEND_URL']}/profile/change-password/${id}`
    }));
  }

  async confirmChangeEmail(id: string, changeEmailCode: string, userData: IRequestInfo['userData']): Promise<{ message: string, title: string }> {
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
    if (!emailHistoryItemIndex || emailHistoryItemIndex === -1) {
      throw new BadRequestException('Invalid change email code');
    }

    if (user.emailHistory?.[emailHistoryItemIndex].email === user.email) {
      throw new BadRequestException('Email is already confirmed');
    }

    user.emailHistory = user.emailHistory?.filter((emailHistoryItem) => changeEmailCode !== emailHistoryItem.changeEmailCode);
    await user.save();
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

  private getUserReturnData(user: UserDocument | null): UserReturnType | null {
    if (!user) {
      return null;
    }

    user.id = user._id.toString();
    return _.omit(user, ['password', '__v', '_id']);
  }
}
