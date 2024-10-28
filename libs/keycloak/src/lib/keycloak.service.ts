import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import {
  ClientRepresentation,
  IdentityProviderRepresentation,
  RealmRepresentation,
  RoleRepresentation,
} from './keycloak.model';

@Injectable()
export class KeycloakService {
  private axiosInstance: AxiosInstance;
  private token: string;
  private tokenExpiresAtMS: number;

  constructor(
    @Inject('KEYCLOAK_REALM_CONFIG') private realmConfig: RealmRepresentation,
    @Inject('KEYCLOAK_REALM') private realm: string,
    @Inject('KEYCLOAK_BASE_URL') private baseUrl: string,
    @Inject('KEYCLOAK_LIVE_UPSERT_REALM') private enableLiveUpsertRealm: boolean,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error);
      },
      onMaxRetryTimesExceeded: (error, retryCount) => {
        console.error(`Failed to make the request after ${retryCount} retries.`);
        throw error;
      }
    });

    this.init();
  }

  private async init() {
    await this.authenticateKeycloak();
    if (this.enableLiveUpsertRealm) {
      await this.upsertRealm(this.realmConfig);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public async authenticateKeycloak() {
    try {
      if (this.token && Date.now() < this.tokenExpiresAtMS) {
        console.log('Already authenticated with Keycloak.');
        return;
      }

      const response = await this.axiosInstance.post(
        '/realms/master/protocol/openid-connect/token',
        new URLSearchParams({
          username: process.env.KC_BOOTSTRAP_ADMIN_USERNAME,
          password: process.env.KC_BOOTSTRAP_ADMIN_PASSWORD,
          grant_type: 'password',
          client_id: 'admin-cli',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data = response.data;
      this.token = data.access_token;

      this.tokenExpiresAtMS = Date.now() + data.expires_in * 1000;

      this.axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${this.token}`;

      console.log('Authenticated with Keycloak realm: master');
    } catch (error) {
      console.error('Failed to authenticate with Keycloak:', error.response, error);
      throw error;
    }
  }

  public async ensureAuthenticated() {
    if (!this.token || Date.now() >= this.tokenExpiresAtMS) {
      await this.authenticateKeycloak();
    }
  }

  async upsertRealm(realmConfig: RealmRepresentation) {
    try {
      await this.ensureAuthenticated();

      let realmExists = false;
      try {
        await this.axiosInstance.get(`/admin/realms/${realmConfig.realm}`);
        realmExists = true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          realmExists = false;
        } else {
          throw error;
        }
      }

      if (realmExists) {
        await this.axiosInstance.put(
          `/admin/realms/${realmConfig.realm}`,
          realmConfig,
        );
        console.log(`Realm ${realmConfig.realm} updated successfully.`);
      } else {
        await this.axiosInstance.post('/admin/realms', realmConfig);
        console.log(`Realm ${realmConfig.realm} created successfully.`);
      }
    } catch (error) {
      console.error(`Failed to upsert realm ${realmConfig.realm}:`, error.response?.data || error);
      throw error;
    }
  }

  async deleteRealm(realmName: string) {
    try {
      await this.ensureAuthenticated();

      await this.axiosInstance.delete(`/admin/realms/${realmName}`);
      console.log(`Realm ${realmName} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete realm ${realmName}:`, error.response?.data || error);
      throw error;
    }
  }

  async createClient(clientConfig: ClientRepresentation) {
    try {
      await this.ensureAuthenticated();

      // Get clients with matching clientId
      const response = await this.axiosInstance.get<ClientRepresentation[]>(
        `/admin/realms/${this.realm}/clients`,
        {
          params: {
            clientId: clientConfig.clientId,
          },
        },
      );
      const clients = response.data;

      if (clients.length === 0) {
        // Create the client
        await this.axiosInstance.post(
          `/admin/realms/${this.realm}/clients`,
          clientConfig,
        );
        console.log(`Client ${clientConfig.clientId} created successfully.`);
      } else {
        console.log(`Client ${clientConfig.clientId} already exists.`);
      }
    } catch (error) {
      console.error(
        `Failed to create client ${clientConfig.clientId}:`,
        error.response?.data || error,
      );
      throw error;
    }
  }

  async updateAdminRole() {
    try {
      await this.ensureAuthenticated();

      // Get roles
      const response = await this.axiosInstance.get<RoleRepresentation[]>(
        `/admin/realms/${this.realm}/roles`,
        {
          params: {
            search: 'admin',
          },
        },
      );
      const roles = response.data;

      const adminRole = roles.find((role) => role.name === 'admin');

      if (adminRole) {
        const roleId = adminRole.id!;
        await this.axiosInstance.put(
          `/admin/realms/${this.realm}/roles-by-id/${roleId}`,
          { description: 'Updated admin role' },
        );
        console.log('Admin role updated.');
      } else {
        console.log('Admin role not found.');
      }
    } catch (error) {
      console.error('Failed to update admin role:', error.response?.data || error);
      throw error;
    }
  }

  async createIdentityProvider(
    identityProviderConfig: IdentityProviderRepresentation,
  ) {
    try {
      await this.ensureAuthenticated();

      // Get existing identity providers
      const response = await this.axiosInstance.get<IdentityProviderRepresentation[]>(
        `/admin/realms/${this.realm}/identity-provider/instances`,
      );
      const identityProviders = response.data;

      const identityProviderExists = identityProviders.some(
        (provider) => provider.alias === identityProviderConfig.alias,
      );

      if (!identityProviderExists) {
        await this.axiosInstance.post(
          `/admin/realms/${this.realm}/identity-provider/instances`,
          identityProviderConfig,
        );
        console.log(
          `Identity provider ${identityProviderConfig.alias} created successfully.`,
        );
      } else {
        console.log(
          `Identity provider ${identityProviderConfig.alias} already exists.`,
        );
      }
    } catch (error) {
      console.error(
        `Failed to create identity provider ${identityProviderConfig.alias}:`,
        error.response?.data || error,
      );
      throw error;
    }
  }
}
