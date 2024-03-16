import { EmailService } from '@gym-app/email';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto, changePasswordDto } from './auth.dto';
import { getRecoverPasswordEmail } from './emailTemplates';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

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
    const response = await this.userService.createRecoverCode(data.email);
    await this.emailService.sendRenderedEmail(
      getRecoverPasswordEmail(data.email, { 
        recoverCode: this.toBase64(response.recoverCode),
        recoverLink: `${process.env.FRONTEND_URL}/auth/confirm-recover?email=${data.email}&token=${this.toBase64(response.recoverCode)}`
      })
    );

    return {};
  }

  async confirmRecover({ email, token }: ConfirmRecoverPasswordDto) {
    const resetPasswordToken = await this.userService.checkRecoverCode(email, this.fromBase64(token));
    if (!resetPasswordToken) {
      throw new Error('Invalid code');
    }
    
    return {
      resetPasswordToken: this.toBase64(resetPasswordToken)
    };
  }

  async changePassword(data: changePasswordDto) {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!data.email || !data.token) {
      throw new Error('Invalid request');
    }

    const changePassword = await this.userService.changePassword(data.email, data.password, this.fromBase64(data.token));
    if (!changePassword) {
      throw new Error('Invalid request');
    }

    return {};
  }

  private toBase64(value: string) {
    return Buffer.from(value).toString('base64');
  }

  private fromBase64(value: string) {
    return Buffer.from(value, 'base64').toString();
  }
}