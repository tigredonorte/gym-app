
import { CreatedUser, KeycloakAuthService } from '@gym-app/keycloak';
import { EmailService, logger } from '@gym-app/shared/api';
import { UserService, getUserAccessData } from '@gym-app/user/api';
import { IRequestInfoDto, IRequestUserDataDto } from '@gym-app/user/types';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CheckEmailDto, ConfirmRecoverPasswordDto, ForgotPasswordDto, LoginDto, LogoutDto, SignupDto, changePasswordDto } from './auth.dto';
import { AuthEventsService } from './auth.events';
import { getRecoverPasswordEmail } from './emails/recorverPasswordEmailData';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private authEventsService: AuthEventsService,
    private kcAuth: KeycloakAuthService
  ) {}

  async signup(data: SignupDto, userData: IRequestInfoDto['userData']): Promise<CreatedUser> {
    try {
      const result = await this.userService.create(data);
      await this.authEventsService.emitSignup({ user: { name: data.name, email: data.email, id: `${result.id}` }, userData });
      return result;
    } catch (error) {
      logger.error('Signup failed', error);
      if (error instanceof HttpException && error.getStatus() === 409) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async checkEmail(data: CheckEmailDto): Promise<boolean> {
    return this.kcAuth.checkUserExistsByEmail(data.email);
  }

  async logout({ sessionId, refreshToken }: LogoutDto, token: string, userData: IRequestInfoDto['userData']) {
    try {
      const { email, name, sub: id } = jwt.decode(token) as { sub: string, name: string, email: string };
      await this.kcAuth.logout(refreshToken);
      await this.authEventsService.emitLogout({ sessionId, user: { email, name, id }, userData });
    } catch (error) {
      logger.error('Failed to logout on keycloak', error);
    }
    return {};
  }

  async login({ email, password }: LoginDto) {
    try {
      logger.info('Login with keycloak');
      const data = await this.kcAuth.login(email, password);
      const {
        sub: id,
        name, email_verified: confirmed,
        sid: sessionId,
      } = jwt.decode(data.access_token) as { sid: string, name: string, email_verified: boolean, sub: string };

      return {
        id,
        name,
        email,
        confirmed,
        sessionId,
        token: data.access_token,
        refreshToken: data.refresh_token,
      };
    } catch (error) {
      logger.error('Failed to login', error);
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(data: ForgotPasswordDto, userData: IRequestInfoDto['userData']) {
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

  async changePassword(data: changePasswordDto, userData: IRequestUserDataDto) {
    if (data.password !== data.confirmPassword) {
      throw new HttpException('Password and confirm password do not match', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (!data.email || !data.token) {
      throw new HttpException('Email and token are required to change password', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userService.doChangePassword(user?.id,  data.password, userData);
    return true;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string, refreshToken: string }> {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required to refresh the token.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    try {
      const result = await this.kcAuth.refreshToken(refreshToken);
      return result;
    } catch (error) {
      logger.error('Failed to refresh token', error);
      throw new UnauthorizedException('Failed to refresh token');
    }
  }
}