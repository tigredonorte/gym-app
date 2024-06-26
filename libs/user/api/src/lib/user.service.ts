import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import _ = require('lodash');
import { UserEventsService } from './user-events.service';

type UserReturnType = Omit<User, 'password'> & { id?: string };

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userEventService: UserEventsService,
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
    const recoverCode = crypto.randomBytes(12).toString('base64');
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

  private getUserReturnData(user: UserDocument | null): UserReturnType | null {
    if (!user) {
      return null;
    }

    user.id = user._id.toString();
    return _.omit(user, ['password', '__v', '_id']);
  }
}
