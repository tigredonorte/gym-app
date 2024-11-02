import { logger } from '@gym-app/shared/api';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakBaseService } from './keycloak-base.service';
import { IKeycloakLoginResponse } from './keycloak.model';

@Injectable()
export class KeycloakAuthService {
  constructor(
    @Inject('KEYCLOAK_CLIENT_ID') private clientId: string,
    @Inject('KEYCLOAK_CLIENT_SECRET') private clientSecret: string,
    @Inject('KEYCLOAK_REALM') private realm: string,
    public kc: KeycloakBaseService
  ) {
    this.kc.init(this.clientId);
  }

  async login(username: string, password: string): Promise<IKeycloakLoginResponse> {
    try {
      logger.warn('Login with Keycloak');

      const response = await this.kc.getRealmAxios().post(
        `/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          username,
          password,
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async signup(username: string, password: string, email: string, firstName: string, lastName: string) {
    try {
      const response = await this.kc.getRealmAxios().post(
        `/admin/realms/${this.realm}/users`,
        {
          username,
          email,
          firstName,
          lastName,
          credentials: [{ type: 'password', value: password, temporary: false }],
          enabled: true,
        },
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to create user in Keycloak:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async recoverPassword(userId: string) {
    try {
      const randomPassword = Math.random().toString(36).slice(-8) + '-' + Math.random().toString(36).slice(-8) + '-' + Math.random().toString(36).slice(-8);
      await this.kc.getRealmAxios().put(
        `/admin/realms/${this.realm}/users/${userId}/reset-password`,
        {
          type: 'password',
          temporary: true,
          value: randomPassword
        },
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return { message: 'Password reset initiated' };
    } catch (error) {
      logger.error('Failed to initiate password recovery:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async changePassword(userId: string, newPassword: string) {
    try {
      await this.kc.getRealmAxios().put(
        `/admin/realms/${this.realm}/users/${userId}/reset-password`,
        {
          type: 'password',
          temporary: false,
          value: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Failed to change password:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async changeEmail(userId: string, newEmail: string) {
    try {
      await this.kc.getRealmAxios().put(
        `/admin/realms/${this.realm}/users/${userId}`,
        { email: newEmail },
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return { message: 'Email updated successfully' };
    } catch (error) {
      logger.error('Failed to change email:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async updateProfile<T extends Record<string, unknown>>(userId: string, profileData: { firstName?: string; lastName?: string; } & T ) {
    try {
      await this.kc.getRealmAxios().put(
        `/admin/realms/${this.realm}/users/${userId}`,
        profileData,
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return { message: 'User profile updated successfully' };
    } catch (error) {
      logger.error('Failed to update user profile:', this.kc.getErrorDetails(error));
      throw error;
    }
  }
}
