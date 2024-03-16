import { EmailService } from '@gym-app/email';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, SignupDto, changePasswordDto } from './auth.dto';
import { getEmailLoginTemplate, getRecoverPasswordEmail } from './emailTemplates';
import { IRequestInfo } from './request-info-middleware';

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

  async forgotPassword(data: ForgotPasswordDto, userData: IRequestInfo['userData']) {
    const response = await this.userService.createRecoverCode(data.email);
    const emailData = this.getUserAccessData(userData);
    await this.emailService.sendRenderedEmail(
      getRecoverPasswordEmail(data.email, {
        ...emailData,
        recoverCode: this.toBase64(response.recoverCode),
        recoverLink: `${process.env.FRONTEND_URL}/auth/confirm-recover?email=${data.email}&token=${this.toBase64(response.recoverCode)}`,
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

  private getUserAccessData(userData: IRequestInfo['userData']) {
    const location = userData.location ? `${userData.location?.city}, ${userData.location?.region}, ${userData.location?.country}`: '';
    const browser = `${userData.deviceInfo?.browser?.name} ${userData.deviceInfo?.browser?.major }`;
    const os = `${userData.deviceInfo?.os?.name} ${userData.deviceInfo?.os?.version}`;
    const device = `${userData.deviceInfo?.device?.vendor} ${userData.deviceInfo?.device?.model}`;
    return { browser, location, os, device };
  }
}