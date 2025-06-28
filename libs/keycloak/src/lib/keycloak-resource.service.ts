import { genHttpError, logger } from '@gym-app/shared/api';
import { Inject, Injectable } from '@nestjs/common';
import { KeycloakBaseService } from './keycloak-base.service';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  RoleRepresentation,
  ScopeRepresentation
} from './keycloak.model';

interface KeycloakChildOptions {
  roles?: RoleRepresentation[];
  policies?: PolicyRepresentation[];
  scopes?: ScopeRepresentation[];
  permissions?: PolicyRepresentation[];
}

@Injectable()
export class KeycloakResourceService {
  private clientUuid = '';
  private basePath = '';

  constructor(
    public kc: KeycloakBaseService,
    @Inject('KEYCLOAK_CHILD_CONFIG') private childConfig: KeycloakChildOptions,
    @Inject('KEYCLOAK_CLIENT_ID') private clientId: string,
    @Inject('KEYCLOAK_REALM') private realm: string,
    @Inject('KEYCLOAK_LIVE_UPSERT_REALM') private enableLiveUpsertRealm: boolean,
  ) {
    this.init();
  }

  private async init() {
    try {
      await this.kc.authenticateKeycloak();

      this.clientUuid = await this.kc.getClientUuid(this.clientId);
      this.basePath = await this.getUrl();

      if (!this.enableLiveUpsertRealm) {
        return;
      }

      if (this.childConfig.roles) {
        await this.createRoles(this.childConfig.roles);
      }
      if (this.childConfig.scopes) {
        await this.createScopes(this.childConfig.scopes);
      }
      if (this.childConfig.policies) {
        await this.createPolicies(this.childConfig.policies);
      }
      if (this.childConfig.permissions) {
        await this.createPermissions(this.childConfig.permissions);
      }
    } catch (error) {
      logger.error('Failed to initialize Keycloak service:', genHttpError(error));
    }
  }

  getUrl() {
    if (!this.clientUuid) {
      throw new Error('Client UUID not found');
    }
    return `/clients/${this.clientUuid}`;
  }

  async getResourceById(resourceId: string): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getAxios().get<ResourceRepresentation>(
        `${this.basePath}/authz/resource-server/resource/${resourceId}`,
      );
      return response.data;
    } catch (error) {
      logger.error(`Failed to get resource ${resourceId}:`, error.response?.data || error);
      throw error;
    }
  }

  async createRoles(roles: RoleRepresentation[]) {
    for (const role of roles) {
      try {
        await this.kc.ensureAuthenticated();

        try {
          await this.kc.getAxios().get(
            `${this.basePath}/roles/${encodeURIComponent(role.name!)}`,
          );
          logger.info(`Role ${role.name} already exists.`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            await this.kc.getAxios().post(
              `${this.basePath}/roles`,
              role,
            );
            logger.info(`Role ${role.name} created.`);
          } else {
            throw error;
          }
        }
      } catch (error) {
        logger.error(`Failed to create role ${role.name}:`, error.response?.data || error);
      }
    }
  }

  async createScopes(scopes: ScopeRepresentation[]) {
    for (const scope of scopes) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.kc.getAxios().get<ScopeRepresentation[]>(
          `${this.basePath}/authz/resource-server/scope`,
        );
        const existingScopes = response.data;

        const scopeExists = existingScopes.some((s) => s.name === scope.name);

        if (!scopeExists) {
          await this.kc.getAxios().post(
            `${this.basePath}/authz/resource-server/scope`,
            scope,
          );
          logger.info(`Scope ${scope.name} created.`);
        } else {
          logger.info(`Scope ${scope.name} already exists.`);
        }
      } catch (error) {
        logger.error(`Failed to create scope ${scope.name}:`, error.response?.data || error);
      }
    }
  }

  async createPolicies(policies: PolicyRepresentation[]) {
    for (const policy of policies) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.kc.getAxios().get<PolicyRepresentation[]>(
          `${this.basePath}/authz/resource-server/policy`,
        );
        const existingPolicies = response.data;

        const policyExists = existingPolicies.some((p) => p.name === policy.name);

        if (policyExists) {
          logger.info(`Policy ${policy.name} already exists.`);
          continue;
        }

        await this.kc.getAxios().post(
          `${this.basePath}/authz/resource-server/policy/${policy.type}`,
          policy,
        );
        logger.info(`Policy ${policy.name} created.`);
      } catch (error) {
        logger.error(`Failed to create policy ${policy.name}:`, error.response?.data || error);
      }
    }
  }

  async createPermissions(permissions: PolicyRepresentation[]) {
    for (const permission of permissions) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.kc.getAxios().get<PolicyRepresentation[]>(
          `${this.basePath}/authz/resource-server/permission`,
        );
        const existingPermissions = response.data;

        const permissionExists = existingPermissions.some((p) => p.name === permission.name);

        if (permissionExists) {
          logger.info(`Permission ${permission.name} already exists.`);
          continue;
        }

        await this.kc.getAxios().post(
          `${this.basePath}/authz/resource-server/permission/${permission.type}`,
          permission,
        );
        logger.info(`Permission ${permission.name} created.`);
      } catch (error) {
        logger.error(`Failed to create permission ${permission.name}:`, error.response?.data || error);
      }
    }
  }

  async createResource(payload: ResourceRepresentation): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.kc.getAxios().post<ResourceRepresentation>(
        `${this.basePath}/authz/resource-server/resource`,
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

      const response = await this.kc.getAxios().post<PolicyRepresentation>(
        `${this.basePath}/authz/resource-server/permission/resource`,
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

      const response = await this.kc.getAxios().post<PolicyRepresentation>(
        `${this.basePath}/authz/resource-server/policy/role`,
        policyPayload,
      );

      logger.info(`Policy ${policyName} created.`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create policy ${policyName}:`, error.response?.data || error);
      throw error;
    }
  }
}
