import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  async create(userData: Partial<User>): Promise<User> {
    try {
      if (userData?.password) {
        userData.password = await this.hashPassword(userData.password);
      }

      const createdUser = new this.userModel(userData);
      await createdUser.save();
      const plain = createdUser.toObject();
      delete plain.password;
      delete plain.__v;
      plain.id = createdUser._id.toString();
      delete plain._id;
      return plain;
    } catch (error) {
      if (error.code === 11000) {  // MongoDB duplicate key error code
        throw new ConflictException('Email already exists');
      }
      throw error; // Re-throw the error if it's not a duplicate key error
    }
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return !!user;
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
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
    delete result.password;
    return result;
  }

  private getRecoverCode(): { code: string, expiresAt: Date, createdAt: Date, changePasswordCode: string } {
    const recoverCode = crypto.randomBytes(12).toString('base64');
    const expiresAt = new Date(new Date().getTime() + 30*60000); // 30 minutes from now
  
    return {
      code: recoverCode,
      expiresAt: expiresAt,
      createdAt: new Date(),
      changePasswordCode: undefined
    };
  }

  async createRecoverCode(email: string): Promise<{ recoverCode: string, exists: boolean }> {
    const user = await this.userModel.findOne({ email }).select('+recoverCode').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.recoverCode && user.recoverCode.expiresAt > new Date()) {
      return {
        recoverCode: user.recoverCode.code,
        exists: true
      };
    }

    user.recoverCode = this.getRecoverCode();
    await user.save();

    return {
      recoverCode: user.recoverCode.code,
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
  
    const changePasswordCode = crypto.randomBytes(12).toString('base64');
    user.recoverCode = {
      code: undefined,
      expiresAt: undefined,
      createdAt: undefined,
      changePasswordCode,
    };
    await user.save();
  
    return changePasswordCode;
  }
}
