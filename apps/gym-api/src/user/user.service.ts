import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';

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
      console.log('password', password);
      console.log('hash', hash);
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
}
