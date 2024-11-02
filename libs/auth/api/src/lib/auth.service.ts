import { KeycloakAuthService } from '@gym-app/keycloak';
import { EmailService, logger } from '@gym-app/shared/api';
import { SessionService, User, UserService, getUserAccessData } from '@gym-app/user/api';
import { IRequestInfoDto, IUserDto } from '@gym-app/user/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import * as _ from 'lodash';
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
    private kcAuth: KeycloakAuthService
  ) {}

  async signup(data: SignupDto, userData: IRequestInfoDto['userData']): Promise<Omit<User, 'password'>> {
  // async signup(data: SignupDto, userData: IRequestInfoDto['userData']): Promise<Omit<User, 'password'>> {
    try {
      const { email, password, name } = data;
      const [firstName, lastName] = name.split(' ');
      const result = await this.kcAuth.signup(email, password, email, firstName, lastName);
      // const { name, id, email } = result;
      // await this.authEventsService.emitSignup({ user: { name, email, id: `${id}` }, userData });
      logger.debug(result, userData);
      // const { name, id, email } = result;
      return result;
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak', this.kcAuth.kc.getErrorDetails(error));
      throw new UnauthorizedError();
    }
  }

  async checkEmail(data: CheckEmailDto): Promise<boolean> {
    return this.userService.emailExists(data.email);
  }

  async logout({ sessionId, accessId }: LogoutDto, userData: IRequestInfoDto['userData']) {
    // const id = await this.sessionService.removeSession(sessionId, accessId);
    // const user = await this.userService.findById(id);
    // if (!user || !user.id) {
    //   throw new Error('User not found');
    // }
    // await this.authEventsService.emitLogout({ sessionId, user: { email: user.email, name: user.name, id: `${user.id}` }, userData });
    return {};
  }

  async login({ email, password }: LoginDto) {
    try {
      logger.info('Login with keycloak');
      const data = await this.kcAuth.login(email, password);
      logger.info(data);
      // Decode the access token
      const decodedAccessToken = jwt.decode(data.access_token) as { sid: string, name: string, email_verified: boolean, sub: string };
      logger.info('Decoded Access Token:', decodedAccessToken);

      // Decode the refresh token if needed
      const decodedRefreshToken = jwt.decode(data.refresh_token);
      logger.info('Decoded Refresh Token:', decodedRefreshToken);

      return {
        id: decodedAccessToken.sub,
        name: decodedAccessToken.name,
        email,
        confirmed: decodedAccessToken.email_verified,
        sessionId: decodedAccessToken.sid,
        token: data.access_token,
      };
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak', this.kcAuth.kc.getErrorDetails(error));
      throw new UnauthorizedError();
    }

    // const result = await this.userService.findByEmailAndPassword(email, password);

    // if (!result || !result.id) {
    //   throw new UnauthorizedError();
    // }

    // const { name, id } = result;

    // const isFirstTimeOnDevice = await this.sessionService.isFirstTimeOnDevice(userData);

    // const token = this.getToken(result);
    // const { sessionId, accessId } = await this.sessionService.createSession(id, userData, token);
    // await this.authEventsService.emitLogin({ user: { email, name, id: `${id}` }, userData, sessionId, isFirstTimeOnDevice });

    // return {
    //   ...result,
    //   sessionId,
    //   accessId,
    //   token,
    // };
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

  async refreshToken(userId: string, oldToken: string, userData: IRequestInfoDto['userData']): Promise<{ token: string }> {

    if (!userId) {
      throw new UnauthorizedError('You must inform the user id');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const tokenData = jwtDecode<IUserDto>(oldToken);
    if (tokenData?.id !== userId) {
      throw new UnauthorizedError('Invalid token');
    }

    oldToken = oldToken.replace('Bearer ', '');
    const session = await this.sessionService.getSessionByToken(oldToken);

    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    if (!_.isEqual(session.deviceInfo, userData.deviceInfo)) {
      throw new UnauthorizedError('Invalid device');
    }

    const token = this.getToken(user);
    if (!token) {
      throw new InternalServerErrorException('Unable to generate token');
    }

    await this.sessionService.updateSessionToken(session._id, token);

    return {
      token,
    };
  }

  private getToken(user: IUserDto): string {
    return jwt.sign(
      user,
      JWT_SECRET,
      { expiresIn: process.env['JWT_EXPIRATION'] || '15min' }
    );
  }
}