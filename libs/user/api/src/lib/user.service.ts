import { CreatedUser, KeycloakAuthService } from '@gym-app/keycloak';
import { EmailService, genHttpError, logger } from '@gym-app/shared/api';
import { IRequestUserDataDto, IUser, UserReturnType } from '@gym-app/user/types';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { getUserAccessData } from './request-info-middleware';
import { UserEventsService } from './user-events.service';
import { IChangeEmail, IChangePassword } from './user.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userEventService: UserEventsService,
    private emailService: EmailService,
    private kcAuth: KeycloakAuthService,
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

  async create({ email, password, name }: { email: string, password: string, name: string }): Promise<CreatedUser> {
    let result: CreatedUser;
    try {
      const [firstName, lastName] = name.split(' ');
      result = await this.kcAuth.signup({ email, password, firstName, lastName });

      if (!result.id) {
        logger.error('UserId not found', result);
        throw new NotFoundException('User id not found');
      }
      await this.userEventService.emitUserCreated(result);
    } catch (error) {
      logger.error('Failed to create user', error);
      throw error;
    }

    try {
      await this.kcAuth.createResource({
        name: 'user',
        uri: `/user/${result.id}`,
        type: 'user',
        owner: { id: result.id, name: result.name },
      });
    } catch (error) {
      logger.error('Failed to create resource in Keycloak', genHttpError(error));
      throw new InternalServerErrorException('Failed to create user resource');
    }

    try {
      const createdUser = new this.userModel({ _id: result.id, email, name });
      await createdUser.save();
      return result;
    } catch (error) {
      logger.error('Failed to create user in database', error);
      throw new InternalServerErrorException('Failed to create user');
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
      logger.error('No recover code found');
      return false;
    }

    const isSameCode = await this.decryptPassword(code, user.recoverCode.code);
    if (!isSameCode) {
      logger.error('Failure to decrypt code');
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

  async changePassword(id: string, { newPassword, oldPassword, confirmPassword }: IChangePassword, userData: IRequestUserDataDto): Promise<boolean> {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    if (newPassword === oldPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const kcUser = await this.findById(id);
    if (!kcUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await this.kcAuth.checkPassword(kcUser.email, oldPassword);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect password');
    }

    await this.doChangePassword(id, newPassword, userData);

    return true;
  }

  async doChangePassword(id: string, newPassword: string, userData: IRequestUserDataDto): Promise<boolean> {
    await this.kcAuth.changePassword(id, newPassword);
    await this.userEventService.emitPasswordChanged(id, getUserAccessData(userData));
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

  async findById(id: string): Promise<UserReturnType | null> {
    const user = await this.userModel.findById(id).lean().exec();
    return this.getUserReturnData(user) as UserReturnType;
  }

  async getUserProfile(id: string): Promise<UserReturnType> {
    const data = await this.kcAuth.loadProfile(id);
    if (!data) {
      throw new NotFoundException('User not found');
    }

    return {
      id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email as string,
      userAvatar: '',
      confirmed: data.emailVerified || false,
      blocked: !data.enabled,
    };
  }

  public async updateUser(id: string, data: Partial<Omit<IUser, 'email'>>): Promise<UserReturnType> {
    const kcData: Record<string, unknown> = {};
    if (data.name) {
      const [firstName, lastName] = data.name.split(' ');
      kcData['firstName'] = firstName;
      kcData['lastName'] = lastName;
    }

    if (kcData['firstName'] || kcData['lastName']) {
      await this.kcAuth.updateProfile(id, kcData);
      this.userEventService.emitUserEdited({ id, ...kcData});
    }

    await this.userModel.updateOne({ _id: id }, data).exec();

    return kcData as unknown as UserReturnType;
  }

  public async changeEmail(id: string, { newEmail, oldEmail }: IChangeEmail, userData: IRequestUserDataDto): Promise<boolean> {
    const kcUser = await this.kcAuth.loadProfile(id);

    if (oldEmail !== kcUser.email) {
      throw new BadRequestException('Old email is incorrect');
    }

    const emailExists = await this.kcAuth.checkUserExistsByEmail(newEmail);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    await this.kcAuth.changeEmail(id, newEmail);

    await this.userEventService.emitChangeEmail({
      userId: id,
      newEmail,
      oldEmail,
      userData: getUserAccessData(userData),
    });

    return true;
  }

  getRandomString(length = 12): string {
    const base64String = crypto.randomBytes(length).toString('base64');
    const urlSafeBase64 = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeBase64;
  }

  private getUserReturnData(user: Partial<UserDocument> | null): Partial<UserReturnType> | null {
    if (!user) {
      return null;
    }

    if (user.toObject) {
      user = user.toObject();
    }

    if (user._id) {
      user.id = user._id.toString();
    }
    return _.omit(user, ['password', '__v', '_id']);
  }
}
