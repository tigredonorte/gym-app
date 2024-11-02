import { getCachedHash, getConfigHash, logger, setCachedHash } from '@gym-app/shared/api';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakBaseService } from './keycloak-base.service';
import {
  ClientRepresentation,
  IdentityProviderRepresentation,
  RealmRepresentation,
  RoleRepresentation,
} from './keycloak.model';

const cacheFilePath = './realmConfigHashCache.txt';

@Injectable()
export class KeycloakService {
  constructor(
    @Inject('KEYCLOAK_REALM_CONFIG') private realmConfig: RealmRepresentation,
    @Inject('KEYCLOAK_REALM') private realm: string,
    @Inject('KEYCLOAK_LIVE_UPSERT_REALM') private enableLiveUpsertRealm: boolean,
    public kc: KeycloakBaseService,
  ) {
    this.init();
  }

  private async init() {
    try {
      await this.kc.authenticateKeycloak();
      if (this.enableLiveUpsertRealm) {
        await this.upsertRealm(this.realmConfig);
      }
    } catch (error) {
      logger.error('Failed to initialize Keycloak service:', error.response?.data || error);
    }
  }

  async upsertRealm(realmConfig: RealmRepresentation) {
    try {
      const currentHash = await getConfigHash(realmConfig);
      const cachedHash = await getCachedHash(cacheFilePath);

      if (currentHash === cachedHash) {
        logger.info(`Realm configuration for ${realmConfig.realm} has not changed. Skipping upsert.`);
        return;
      }

      await this.kc.ensureAuthenticated();

      let realmExists = false;
      try {
        await this.kc.getAxios().get(`/admin/realms/${realmConfig.realm}`);
        realmExists = true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          realmExists = false;
        } else {
          throw error;
        }
      }

      logger.info(realmConfig['clients']);

      if (realmExists) {
        await Promise.all([
          this.kc.getAxios().put(`/admin/realms/${realmConfig.realm}`, realmConfig),
          ...(realmConfig['clients']?.map((client) => this.createClient(client)) || []),
          ...(realmConfig['identityProviders']?.map((client) => this.createIdentityProvider(client)) || []),
        ]);

        logger.info(`Realm ${realmConfig.realm} updated successfully.`);

      } else {
        await this.kc.getAxios().post('/admin/realms', realmConfig);
        logger.info(`Realm ${realmConfig.realm} created successfully.`);
      }

      await setCachedHash(cacheFilePath, currentHash);
    } catch (error) {
      logger.error(`Failed to upsert realm ${realmConfig.realm}:`, error.response?.data || error);
      throw error;
    }
  }

  async deleteRealm(realmName: string) {
    try {
      await this.kc.ensureAuthenticated();

      await this.kc.getAxios().delete(`/admin/realms/${realmName}`);
      logger.info(`Realm ${realmName} deleted successfully.`);
    } catch (error) {
      logger.error(`Failed to delete realm ${realmName}:`, error.response?.data || error);
      throw error;
    }
  }

  async updateAdminRole() {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getAxios().get<RoleRepresentation[]>(
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
        await this.kc.getAxios().put(
          `/admin/realms/${this.realm}/roles-by-id/${roleId}`,
          { description: 'Updated admin role' },
        );
        logger.info('Admin role updated.');
      } else {
        logger.info('Admin role not found.');
      }
    } catch (error) {
      logger.error('Failed to update admin role:', error.response?.data || error);
      throw error;
    }
  }

  private async createClient(clientConfig: ClientRepresentation) {
    try {
      const response = await this.kc.getAxios().get<ClientRepresentation[]>(
        `/admin/realms/${this.realm}/clients`,
        {
          params: {
            clientId: clientConfig.clientId,
          },
        },
      );
      const clients = response.data;

      if (clients.length === 0) {
        await this.kc.getAxios().post(
          `/admin/realms/${this.realm}/clients`,
          clientConfig,
        );
        logger.info(`Client ${clientConfig.clientId} created successfully.`);
      } else {
        const existingClientId = clients[0].id;
        await this.kc.getAxios().put(
          `/admin/realms/${this.realm}/clients/${existingClientId}`,
          clientConfig,
        );
        logger.info(`Client ${clientConfig.clientId} updated successfully.`);
      }
    } catch (error) {
      logger.error(
        `Failed to create client ${clientConfig.clientId}:`,
        error.response?.data || error,
      );
      throw error;
    }
  }

  private async createIdentityProvider(
    identityProviderConfig: IdentityProviderRepresentation,
  ) {
    try {
      const response = await this.kc.getAxios().get<IdentityProviderRepresentation[]>(
        `/admin/realms/${this.realm}/identity-provider/instances`,
      );
      const identityProviders = response.data;

      const existingProvider = identityProviders.find(
        (provider) => provider.alias === identityProviderConfig.alias,
      );

      if (!existingProvider) {
        await this.kc.getAxios().post(
          `/admin/realms/${this.realm}/identity-provider/instances`,
          identityProviderConfig,
        );
        logger.info(
          `Identity provider ${identityProviderConfig.alias} created successfully.`,
        );
      } else {
        await this.kc.getAxios().put(
          `/admin/realms/${this.realm}/identity-provider/instances/${existingProvider.alias}`,
          identityProviderConfig,
        );
        logger.info(
          `Identity provider ${identityProviderConfig.alias} updated successfully.`,
        );
      }
    } catch (error) {
      logger.error(
        `Failed to create identity provider ${identityProviderConfig.alias}:`,
        error.response?.data || error,
      );
      throw error;
    }
  }
}
