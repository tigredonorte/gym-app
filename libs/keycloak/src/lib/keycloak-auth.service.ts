import { genHttpError, logger } from '@gym-app/shared/api';
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { KeycloakBaseService } from './keycloak-base.service';
import {
  CreatedUser,
  IKeycloakLoginResponse,
  PolicyRepresentation,
  ResourceRepresentation,
  SignupUser,
  UserRepresentation,
  UserSession,
} from './keycloak.model';

@Injectable()
export class KeycloakAuthService {
  private clientUuid = '';
  constructor(
    @Inject('KEYCLOAK_CLIENT_ID') private clientId: string,
    @Inject('KEYCLOAK_CLIENT_SECRET') private clientSecret: string,
    public kc: KeycloakBaseService,
  ) {
    this.init();
  }

  async init() {
    await this.kc.init(this.clientId);
    this.clientUuid = await this.kc.getClientUuid(this.clientId);
    if (!this.clientUuid) {
      throw new Error('Client UUID not found');
    }
  }

  async login(username: string, password: string): Promise<IKeycloakLoginResponse> {
    try {
      const response = await this.kc.getOpenIDAxios().post(
        '/token',
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
      const err = genHttpError(error);
      logger.error('Failed to login on keycloak:', err);
      throw err;
    }
  }

  async signup({ password, email, firstName, lastName }: SignupUser): Promise<CreatedUser> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().post<CreatedUser>(
        '/users',
        {
          username: email,
          email,
          firstName,
          lastName,
          credentials: [{ type: 'password', value: password, temporary: false }],
          enabled: true,
        },
      );

      const location = response.headers['location'];
      if (!location) {
        throw new Error('Failed to retrieve the location of the created user.');
      }
      const userId = location.split('/').pop(); // Get the user ID from the URL

      return {
        id: userId,
        email,
        name: `${firstName} ${lastName}`,
        createdTimestamp: Date.now(),
      } as CreatedUser;
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to create user in Keycloak:', err);
      throw err;
    }
  }

  async recoverPassword(userId: string) {
    try {
      const randomPassword =
        Math.random().toString(36).slice(-8) +
        '-' +
        Math.random().toString(36).slice(-8) +
        '-' +
        Math.random().toString(36).slice(-8);
      await this.kc.getRealmAxios().put(
        `/users/${userId}/reset-password`,
        {
          type: 'password',
          temporary: true,
          value: randomPassword,
        },
      );

      return { message: 'Password reset initiated' };
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to initiate password recovery:', err);
      throw err;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await this.kc.getOpenIDAxios().post(
        '/token',
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
      const err = genHttpError(error);
      logger.error('Failed to refresh token:', err);
      throw err;
    }
  }

  async changePassword(userId: string, newPassword: string) {
    try {
      await this.kc.getRealmAxios().put(
        `/users/${userId}/reset-password`,
        {
          type: 'password',
          temporary: false,
          value: newPassword,
        },
      );

      return { message: 'Password changed successfully' };
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to change password:', err);
      throw err;
    }
  }

  async changeEmail(userId: string, newEmail: string) {
    try {
      await this.kc.getRealmAxios().put(
        `/users/${userId}`,
        { email: newEmail },
      );

      return { message: 'Email updated successfully' };
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to change email:', err);
      throw err;
    }
  }

  async updateProfile<T extends Record<string, unknown>>(
    userId: string,
    profileData: { firstName?: string; lastName?: string } & T,
  ) {
    try {
      await this.kc.getRealmAxios().put(
        `/users/${userId}`,
        profileData,
      );

      return { message: 'User profile updated successfully' };
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to update user profile:', err);
      throw err;
    }
  }

  public async loadProfile(userId: string): Promise<UserRepresentation> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        logger.error(`User not found for id '${userId}'`);
        throw new Error('User not found');
      }

      const err = genHttpError(error);
      logger.error(`Error loading user profile for id '${userId}'`, err);
      throw err;
    }
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get<UserSession[]>(
        `/users/${userId}/sessions`,
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        logger.error(`User not found or no active sessions for id '${userId}'`);
        throw new Error('User not found or no active sessions');
      }

      const err = genHttpError(error);
      logger.error(`Error retrieving sessions for user id '${userId}'`, err);
      throw err;
    }
  }

  async checkPassword(userEmail: string, password: string): Promise<boolean> {
    try {
      await this.login(userEmail, password);
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        logger.info(`Password check failed for userEmail ${userEmail}: Incorrect password.`);
        return false;
      }

      const err = genHttpError(error);
      logger.error(`Error during password check for userEmail ${userEmail}:`, err);
      throw err;
    }
  }

  async createResource(payload: ResourceRepresentation): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().post<ResourceRepresentation>(
        `/clients/${this.clientUuid}/authz/resource-server/resource`,
        payload,
      );

      logger.info(`Resource ${payload.name} created.`);
      return response.data;
    } catch (error) {
      const err = genHttpError(error);
      logger.error(`Failed to create resource ${payload.name}:`, { error: err, payload });
      throw err;
    }
  }

  async createPermission(
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
        `/clients/${this.clientUuid}/authz/resource-server/permission/resource`,
        permissionPayload,
      );

      logger.info(`Permission ${permissionName} created.`);
      return response.data;
    } catch (error) {
      const err = genHttpError(error);
      logger.error(`Failed to create permission ${permissionName}:`, err);
      throw err;
    }
  }

  async createPolicy(policyName: string): Promise<PolicyRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const policyPayload: PolicyRepresentation = {
        name: policyName,
        type: 'role',
      };

      const response = await this.kc.getRealmAxios().post<PolicyRepresentation>(
        `/clients/${this.clientUuid}/authz/resource-server/policy/role`,
        policyPayload,
      );

      logger.info(`Policy ${policyName} created.`);
      return response.data;
    } catch (error) {
      const err = genHttpError(error);
      logger.error(`Failed to create policy ${policyName}:`, err);
      throw err;
    }
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getRealmAxios().get('/users', {
        params: { email },
      });

      return response.data && response.data.length > 0;
    } catch (error) {
      const err = genHttpError(error);
      logger.error(`Failed to check user existence by email (${email}):`, err);
      throw err;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.kc.getOpenIDAxios().post(
        '/logout',
        new URLSearchParams({
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
      logger.info('User successfully logged out from Keycloak.');
    } catch (error) {
      const err = genHttpError(error);
      logger.error('Failed to logout from Keycloak:', err);
      throw err;
    }
  }

  async checkUserExists(userId: string): Promise<boolean> {
    return this.checkIfExists('/users', userId);
  }

  async checkResourceExists(resourceId: string): Promise<boolean> {
    return this.checkIfExists(
      `/clients/${this.clientUuid}/authz/resource-server/resource`,
      resourceId,
    );
  }

  async checkPolicyExists(policyId: string): Promise<boolean> {
    return this.checkIfExists(
      `/clients/${this.clientUuid}/authz/resource-server/policy`,
      policyId,
    );
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
      }
      const err = genHttpError(error);
      logger.error(`Error checking existence at ${endpoint}/${identifier}`, err);
      throw err;
    }
  }

  verifyToken(token: string): jwt.JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.kc.publicKey, {
        algorithms: ['RS256'],
        issuer: this.kc.realmUrl
      }) as jwt.JwtPayload;

      return {
        ...decoded,
        sub: decoded.sub as string,
        email: decoded.email as string,
        name: decoded.name as string,
        email_verified: decoded.email_verified as boolean,
        blocked: (decoded.blocked as boolean) || false
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.info('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.info('Token validation failed:', error.message);
      } else {
        logger.error('Error validating token:', error);
      }
      return null;
    }
  }
}
