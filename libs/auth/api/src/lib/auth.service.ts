
import { CreatedUser, KeycloakAuthService } from '@gym-app/keycloak';
import { EmailService, logger } from '@gym-app/shared/api';
import { SessionService, UserService, getUserAccessData } from '@gym-app/user/api';
import { IRequestInfoDto } from '@gym-app/user/types';
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
    private sessionService: SessionService,
    private kcAuth: KeycloakAuthService
  ) {}

  async signup(data: SignupDto, userData: IRequestInfoDto['userData']): Promise<CreatedUser> {
    let result: CreatedUser;
    try {
      const { email, password, name } = data;
      const [firstName, lastName] = name.split(' ');
      result = await this.kcAuth.signup({ email, password, firstName, lastName });
      const { id } = result;
      await this.authEventsService.emitSignup({ user: { name, email, id: `${id}` }, userData });
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak', this.kcAuth.kc.getErrorDetails(error));
      throw new UnauthorizedException();
    }

    try {
      await this.kcAuth.createResource({
        name: 'user',
        uri: `/user/${result.id}`,
        type: 'user',
        owner: { id: result.id, name: result.name },
      });
    } catch (error) {
      logger.error('Failed to create resource in Keycloak', this.kcAuth.kc.getErrorDetails(error));
      throw new InternalServerErrorException();
    }
    return result;

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
      logger.error('Failed to logout on keycloak', this.kcAuth.kc.getErrorDetails(error));
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
      logger.error('Failed to authenticate with Keycloak', this.kcAuth.kc.getErrorDetails(error));
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

  async refreshToken(refreshToken: string): Promise<{ token: string, refreshToken: string }> {
    if (!refreshToken) {
      throw new HttpException('Refresh token is required to refresh the token.', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    try {
      const result = await this.kcAuth.refreshToken(refreshToken);
      return result;
    } catch (error) {
      logger.error('Failed to refresh token', this.kcAuth.kc.getErrorDetails(error));
      throw new UnauthorizedException('Failed to refresh token');
    }
  }
}