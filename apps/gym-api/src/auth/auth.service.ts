import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto, changePasswordDto } from './auth.dto';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {}

  async signup(data: SignupDto): Promise<User> {
    return this.userService.create(data);
  }

  async checkEmail(data: CheckEmailDto): Promise<boolean> {
    return this.userService.emailExists(data.email);
  }

  async login({ email, password }: LoginDto) {
    const [result, emailExists] = await Promise.all([
      this.userService.findByEmailAndPassword(email, password),
      this.userService.emailExists(email)
    ]);
    if (result) {
      return result;
    }

    if (!emailExists) {
      throw new Error('Email does not exist');
    }
    throw new Error('Invalid password');
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const recoverCode = await this.userService.createRecoverCode(data.email);

    // @TODO: Send email with recover code
    console.log('Recover code', recoverCode);

    return {};
  }

  async confirmRecover({ email, token }: ConfirmRecoverPasswordDto) {
    const resetPasswordToken = await this.userService.checkRecoverCode(email, token);
    if (!resetPasswordToken) {
      throw new Error('Invalid code');
    }
    
    return {
      resetPasswordToken
    };
  }

}