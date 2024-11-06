import { logger } from '@gym-app/shared/api';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakBaseService } from './keycloak-base.service';
import {
  CreatedUser,
  IKeycloakLoginResponse,
  PolicyRepresentation,
  ResourceRepresentation,
  SignupUser,
  UserRepresentation,
  UserSession
} from './keycloak.model';

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

  async signup({ password, email, firstName, lastName }: SignupUser): Promise<CreatedUser> {
    try {
      const response = await this.kc.getRealmAxios().post<CreatedUser>(
        `/admin/realms/${this.realm}/users`,
        {
          username: email,
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

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await this.kc.getRealmAxios().post(
        `/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    } catch (error) {
      logger.error('Failed to refresh token:', this.kc.getErrorDetails(error));
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

  public async loadProfile(userId: string): Promise<UserRepresentation> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get(`/admin/realms/${this.realm}/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        logger.error(`User not found for id '${userId}'`);
        throw new Error('User not found');
      }

      logger.error(`Error loading user profile for id '${userId}'`, this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get<UserSession[]>(
        `/admin/realms/${this.realm}/users/${userId}/sessions`,
        {
          headers: { Authorization: `Bearer ${this.kc.getToken()}` },
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        logger.error(`User not found or no active sessions for id '${userId}'`);
        throw new Error('User not found or no active sessions');
      }

      logger.error(`Error retrieving sessions for user id '${userId}'`, this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async createResource(payload: ResourceRepresentation): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().post<ResourceRepresentation>(
        '/authz/resource-server/resource',
        payload,
      );

      logger.info(`Resource ${payload.name} created.`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create resource ${payload.name}:`, error.response?.data || error);
      throw error;
    }
  }

  async createPermission(
    clientId: string,
    permissionName: string,
    resourceName: string,
  ): Promise<PolicyRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const permissionPayload: PolicyRepresentation = {
        name: permissionName,
        resources: [resourceName],
        policies: ['owner-only-policy', 'organization-access-policy'],
        type: 'resource',
      };

      const response = await this.kc.getRealmAxios().post<PolicyRepresentation>(
        '/authz/resource-server/permission/resource',
        permissionPayload,
      );

      logger.info(`Permission ${permissionName} created.`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create permission ${permissionName}:`, error.response?.data || error);
      throw error;
    }
  }

  async createPolicy(clientId: string, policyName: string): Promise<PolicyRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const policyPayload: PolicyRepresentation = {
        name: policyName,
        type: 'role',
      };

      const response = await this.kc.getRealmAxios().post<PolicyRepresentation>(
        '/authz/resource-server/policy/role',
        policyPayload,
      );

      logger.info(`Policy ${policyName} created.`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create policy ${policyName}:`, error.response?.data || error);
      throw error;
    }
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get(`/admin/realms/${this.realm}/users`, {
        params: { email },
      });

      // If users are found with the given email, the list will not be empty
      return response.data && response.data.length > 0;
    } catch (error) {
      logger.error(`Failed to check user existence by email (${email}):`, this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.kc.getRealmAxios().post(
        `/realms/${this.realm}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      logger.info('User successfully logged out from Keycloak.');
    } catch (error) {
      logger.error('Failed to logout from Keycloak:', this.kc.getErrorDetails(error));
      throw error;
    }
  }

  async checkUserExists(userId: string): Promise<boolean> {
    return this.checkIfExists(`/admin/realms/${this.realm}/users`, userId);
  }

  async checkResourceExists(resourceId: string): Promise<boolean> {
    return this.checkIfExists('/authz/resource-server/resource', resourceId);
  }

  async checkPolicyExists(policyId: string): Promise<boolean> {
    return this.checkIfExists('/authz/resource-server/policy', policyId);
  }

  private async checkIfExists(endpoint: string, identifier: string): Promise<boolean> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get(`${endpoint}/${identifier}`);
      return response.status === 200;
    } catch (error) {
      if (error.response?.status === 404) {
        logger.info(`Resource not found at ${endpoint}/${identifier}`);
        return false;
      } else {
        logger.error(`Error checking existence at ${endpoint}/${identifier}`, this.kc.getErrorDetails(error));
        throw error;
      }
    }
  }
}
