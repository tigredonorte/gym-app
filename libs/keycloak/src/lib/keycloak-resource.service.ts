import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  RoleRepresentation,
  ScopeRepresentation,
  ClientRepresentation,
} from './keycloak.model';
import { KeycloakService } from './keycloak.service';
import axiosRetry from 'axios-retry';

interface KeycloakChildOptions {
  roles?: RoleRepresentation[];
  policies?: PolicyRepresentation[];
  scopes?: ScopeRepresentation[];
  permissions?: PolicyRepresentation[];
}

@Injectable()
export class KeycloakResourceService {
  private axiosInstance: AxiosInstance;
  private clientUuid = '';
  private basePath = '';

  constructor(
    public kc: KeycloakService,
    @Inject('KEYCLOAK_CHILD_CONFIG') private childConfig: KeycloakChildOptions,
    @Inject('KEYCLOAK_CLIENT_ID') private clientId: string,
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
    await this.kc.authenticateKeycloak();

    // Set the authorization header for axiosInstance
    const token = this.kc.getToken();
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    this.clientUuid = await this.getClientUuid(this.clientId);
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
  }

  private async getClientUuid(clientId: string): Promise<string> {
    if (this.clientUuid) {
      return this.clientUuid;
    }
    await this.kc.ensureAuthenticated();
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
  }

  getUrl() {
    if (!this.clientUuid) {
      throw new Error('Client UUID not found');
    }
    return `/admin/realms/${this.realm}/clients/${this.clientUuid}`;
  }

  async getResourceById(resourceId: string): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.axiosInstance.get<ResourceRepresentation>(
        `${this.basePath}/authz/resource-server/resource/${resourceId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get resource ${resourceId}:`, error.response?.data || error);
      throw error;
    }
  }

  async createRoles(roles: RoleRepresentation[]) {
    for (const role of roles) {
      try {
        await this.kc.ensureAuthenticated();

        // Check if the role exists
        try {
          await this.axiosInstance.get(
            `/admin/realms/${this.realm}/roles/${encodeURIComponent(role.name!)}`,
          );
          console.log(`Role ${role.name} already exists.`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Create the role
            await this.axiosInstance.post(
              `/admin/realms/${this.realm}/roles`,
              role,
            );
            console.log(`Role ${role.name} created.`);
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error(`Failed to create role ${role.name}:`, error.response?.data || error);
      }
    }
  }

  async createScopes(scopes: ScopeRepresentation[]) {
    for (const scope of scopes) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.axiosInstance.get<ScopeRepresentation[]>(
          `${this.basePath}/authz/resource-server/scope`,
        );
        const existingScopes = response.data;

        const scopeExists = existingScopes.some((s) => s.name === scope.name);

        if (!scopeExists) {
          await this.axiosInstance.post(
            `${this.basePath}/authz/resource-server/scope`,
            scope,
          );
          console.log(`Scope ${scope.name} created.`);
        } else {
          console.log(`Scope ${scope.name} already exists.`);
        }
      } catch (error) {
        console.error(`Failed to create scope ${scope.name}:`, error.response?.data || error);
      }
    }
  }

  async createPolicies(policies: PolicyRepresentation[]) {
    for (const policy of policies) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.axiosInstance.get<PolicyRepresentation[]>(
          `${this.basePath}/authz/resource-server/policy`,
        );
        const existingPolicies = response.data;

        const policyExists = existingPolicies.some((p) => p.name === policy.name);

        if (policyExists) {
          console.log(`Policy ${policy.name} already exists.`);
          continue;
        }

        await this.axiosInstance.post(
          `${this.basePath}/authz/resource-server/policy/${policy.type}`,
          policy,
        );
        console.log(`Policy ${policy.name} created.`);
      } catch (error) {
        console.error(`Failed to create policy ${policy.name}:`, error.response?.data || error);
      }
    }
  }

  async createPermissions(permissions: PolicyRepresentation[]) {
    for (const permission of permissions) {
      try {
        await this.kc.ensureAuthenticated();

        const response = await this.axiosInstance.get<PolicyRepresentation[]>(
          `${this.basePath}/authz/resource-server/permission`,
        );
        const existingPermissions = response.data;

        const permissionExists = existingPermissions.some((p) => p.name === permission.name);

        if (permissionExists) {
          console.log(`Permission ${permission.name} already exists.`);
          continue;
        }

        await this.axiosInstance.post(
          `${this.basePath}/authz/resource-server/permission/${permission.type}`,
          permission,
        );
        console.log(`Permission ${permission.name} created.`);
      } catch (error) {
        console.error(`Failed to create permission ${permission.name}:`, error.response?.data || error);
      }
    }
  }

  async createResource(payload: ResourceRepresentation): Promise<ResourceRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const response = await this.axiosInstance.post<ResourceRepresentation>(
        `${this.basePath}/authz/resource-server/resource`,
        payload,
      );

      console.log(`Resource ${payload.name} created.`);
      return response.data;
    } catch (error) {
      console.error(`Failed to create resource ${payload.name}:`, error.response?.data || error);
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

      const response = await this.axiosInstance.post<PolicyRepresentation>(
        `${this.basePath}/authz/resource-server/permission/resource`,
        permissionPayload,
      );

      console.log(`Permission ${permissionName} created.`);
      return response.data;
    } catch (error) {
      console.error(`Failed to create permission ${permissionName}:`, error.response?.data || error);
      throw error;
    }
  }

  async createPolicy(clientId: string, policyName: string): Promise<PolicyRepresentation> {
    try {
      await this.kc.ensureAuthenticated();

      const policyPayload: PolicyRepresentation = {
        name: policyName,
        type: 'role',
        // Include other necessary fields
      };

      const response = await this.axiosInstance.post<PolicyRepresentation>(
        `${this.basePath}/authz/resource-server/policy/role`,
        policyPayload,
      );

      console.log(`Policy ${policyName} created.`);
      return response.data;
    } catch (error) {
      console.error(`Failed to create policy ${policyName}:`, error.response?.data || error);
      throw error;
    }
  }
}
