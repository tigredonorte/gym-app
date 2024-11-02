import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { ClientRepresentation } from './keycloak.model';
import { logger } from '@gym-app/shared/api';

@Injectable()
export class KeycloakBaseService {
  static authState = {
    authenticating: false,
    token: '',
  };
  private axiosInstance: AxiosInstance;
  private axiosInstanceRealm: AxiosInstance;
  private clientUuid = '';
  private basePath = '';
  private tokenExpiresAtMS = 0;

  constructor(
    @Inject('KEYCLOAK_REALM') private realm: string,
    @Inject('KEYCLOAK_BASE_URL') private baseUrl: string,
  ) {
    this.axiosInstance = this.createInstance(this.baseUrl);
    this.axiosInstanceRealm = this.createInstance(this.baseUrl);
  }

  private createInstance (baseURL: string): AxiosInstance {
    const instance = axios.create({ baseURL });
    axiosRetry(instance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => (
        axiosRetry.isNetworkError(error) ||
        (error.response?.status && error.response.status >= 500 && error.response.status < 600)
      ),
      onMaxRetryTimesExceeded: (error, retryCount) => {
        logger.error(`Failed to make the request after ${retryCount} retries.`);
        throw error;
      }
    });
    return instance;
  }

  public async init(clientId: string) {
    try {
      await this.authenticateKeycloak();

      if (clientId) {
        this.clientUuid = await this.getClientUuid(clientId);
        this.basePath = await this.getUrl();
      }
    } catch (error) {
      logger.error('Failed to initialize Keycloak service:', this.getErrorDetails(error));
    }
  }

  public getUrl() {
    if (!this.clientUuid) {
      throw new Error('Client UUID not found');
    }
    return `/admin/realms/${this.realm}/clients/${this.clientUuid}`;
  }

  public async authenticateKeycloak() {
    try {
      const maxCount = 3;
      let count = maxCount;
      while (KeycloakBaseService.authState.authenticating && count-- > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2 * 1000 * (maxCount - count)));
      }

      if (KeycloakBaseService.authState.token && Date.now() < this.tokenExpiresAtMS) {
        logger.info('Already authenticated with Keycloak.');
        return;
      }

      KeycloakBaseService.authState = {
        authenticating: true,
        token: '',
      };

      const data = await this.login(
        process.env.KC_BOOTSTRAP_ADMIN_USERNAME,
        process.env.KC_BOOTSTRAP_ADMIN_PASSWORD,
        undefined,
        'admin-cli',
        'master',
      );

      KeycloakBaseService.authState = {
        authenticating: false,
        token: data.access_token,
      };

      this.tokenExpiresAtMS = Date.now() + data.expires_in * 1000;

      logger.debug('Authenticated with Keycloak realm: master');

    } catch (error) {
      logger.error('Failed to authenticate with Keycloak:', this.getErrorDetails(error));
    } finally {
      if (KeycloakBaseService.authState.token) {
        this.axiosInstance.defaults.headers.common[ 'Authorization'] = `Bearer ${KeycloakBaseService.authState.token}`;
      }
    }
  }

  public getToken(): string {
    return KeycloakBaseService.authState.token;
  }

  private async getClientUuid(clientId: string): Promise<string> {
    if (this.clientUuid) {
      return this.clientUuid;
    }
    try {
      await this.ensureAuthenticated();
      const response = await this.axiosInstance.get<ClientRepresentation[]>(
        `/admin/realms/${this.realm}/clients`,
        {
          params: { clientId },
        },
      );
      const clients = response.data;
      if (clients.length > 0) {
        return clients[0].id!;
      } else {
        throw new Error(`Client ${clientId} not found`);
      }
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak:', this.getErrorDetails(error));
      throw error;
    }
  }

  async login(
    username: string,
    password: string,
    clientSecret,
    clientId,
    realm,
  ) {
    try {
      const response = await this.axiosInstance.post(
        `/realms/${realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          username,
          password,
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to authenticate with Keycloak:', this.getErrorDetails(error));
      throw error;
    }
  }

  public async ensureAuthenticated() {
    if (!KeycloakBaseService.authState.token || Date.now() >= this.tokenExpiresAtMS) {
      await this.authenticateKeycloak();
    }
  }

  public getRealm() {
    return this.realm;
  }

  public getBasePath() {
    return this.basePath;
  }

  public getAxios() {
    return this.axiosInstance;
  }

  public getRealmAxios() {
    return this.axiosInstanceRealm;
  }

  public getErrorDetails(error: unknown) {
    return error instanceof AxiosError ? {
      status: error.response?.status || error.status,
      code: error.code,
      data: error.response?.data,
    } : undefined;
  }
}
