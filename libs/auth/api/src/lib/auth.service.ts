import { EmailService } from '@gym-app/email';
import { IRequestInfo, User, UserService, getUserAccessData, SessionService } from '@gym-app/user/api';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, LogoutDto, SignupDto, changePasswordDto } from './auth.dto';
import { AuthEventsService } from './auth.events';
import { getRecoverPasswordEmail } from './emails/recorverPasswordEmailData';
import { UnauthorizedError } from './errors/UnauthorizedError';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private authEventsService: AuthEventsService,
    private sessionService: SessionService,
  ) {}

  async signup(data: SignupDto, userData: IRequestInfo['userData']): Promise<Omit<User, 'password'>> {
    const result = await this.userService.create(data);
    const { name, id, email } = result;
    await this.authEventsService.emitSignup({ user: { name, email, id: `${id}` }, userData });
    return result;
  }

  async checkEmail(data: CheckEmailDto): Promise<boolean> {
    return this.userService.emailExists(data.email);
  }

  async logout({ sessionId }: LogoutDto, userData: IRequestInfo['userData']) {
    const id = await this.sessionService.removeSession(sessionId);
    const user = await this.userService.findById(id);
    if (!user || !user.id) {
      throw new Error('User not found');
    }
    await this.authEventsService.emitLogout({ sessionId, user: { email: user.email, name: user.name, id: `${user.id}` }, userData });
    return {};
  }

  async login({ email, password }: LoginDto, userData: IRequestInfo['userData']) {
    const result = await this.userService.findByEmailAndPassword(email, password);

    if (!result || !result.id) {
      throw new UnauthorizedError();
    }

    const { name, id } = result;

    const isFirstTimeOnDevice = await this.sessionService.isFirstTimeOnDevice(userData);

    const token = jwt.sign(
      result,
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );
    const sessionId = await this.sessionService.createSession(id, userData, token);
    await this.authEventsService.emitLogin({ user: { email, name, id: `${id}` }, userData, sessionId, isFirstTimeOnDevice });

    return {
      ...result,
      sessionId,
      token,
    };
  }

  async forgotPassword(data: ForgotPasswordDto, userData: IRequestInfo['userData']) {
    const response = await this.userService.createRecoverCode(data.email);
    const emailData = getUserAccessData(userData);
    await this.emailService.sendRenderedEmail(
      getRecoverPasswordEmail(data.email, {
        ...emailData,
        recoverCode: response.recoverCode,
        recoverLink: `${process.env['FRONTEND_URL']}/auth/confirm-recover?email=${data.email}&token=${response.recoverCode}`,
      })
    );
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

  async changePassword(data: changePasswordDto, ip: string) {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!data.email || !data.token) {
      throw new Error('Invalid request');
    }

    const changePassword = await this.userService.changePassword(data.email, data.password, data.token, ip);
    if (!changePassword) {
      throw new Error('Invalid request');
    }

    return {};
  }
}