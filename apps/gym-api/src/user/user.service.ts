import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
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
}
