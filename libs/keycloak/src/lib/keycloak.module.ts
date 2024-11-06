import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard, TokenValidation } from 'nest-keycloak-connect';
import { KeycloakAuthService } from './keycloak-auth.service';
import { KeycloakBaseService } from './keycloak-base.service';
import { KeycloakResourceService } from './keycloak-resource.service';
import { ClientRepresentation, PolicyRepresentation, RealmRepresentation, RoleRepresentation, ScopeRepresentation } from './keycloak.model';
import { KeycloakService } from './keycloak.service';

interface KeycloakRootOptions {
  realmConfig: RealmRepresentation
  client: ClientRepresentation
  upsertRealmOnInit?: boolean
}

interface KeycloakChildOptions {
  roles?: RoleRepresentation[];
  policies?: PolicyRepresentation[];
  scopes?: ScopeRepresentation[];
  permissions?: PolicyRepresentation[];
}

@Global()
@Module({})
export class KeycloakModule {
  static forRoot(options: KeycloakRootOptions): DynamicModule {
    const authServerUrl = options.client.rootUrl?.split('/realms')[0];
    return {
      module: KeycloakModule,
      imports: [
        KeycloakConnectModule.register({
          authServerUrl,
          clientId: options.client.clientId,
          secret: options.client.secret,
          realm: options.realmConfig.realm,
          tokenValidation: TokenValidation.OFFLINE
        }),
      ],
      providers: [
        KeycloakService,
        KeycloakBaseService,
        {
          provide: 'KEYCLOAK_REALM_CONFIG',
          useValue: options.realmConfig,
        },
        {
          provide: 'KEYCLOAK_CLIENT_ID',
          useValue: options.client.clientId,
        },
        {
          provide: 'KEYCLOAK_REALM',
          useValue: options.realmConfig.realm,
        },
        {
          provide: 'KEYCLOAK_BASE_URL',
          // @TODO() it should work with this external url: process.env.KC_HOSTNAME,
          // useValue: process.env.KC_HOSTNAME,
          useValue: authServerUrl,
        },
        {
          provide: 'KEYCLOAK_LIVE_UPSERT_REALM', // use this one to update realm on the fly
          useValue: options.upsertRealmOnInit ?? false,
        },
        {
          provide: 'KEYCLOAK_CLIENT_SECRET',
          useValue: process.env.KEYCLOAK_CLIENT_SECRET,
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: ResourceGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RoleGuard,
        },
      ],
      exports: [
        KeycloakService,
        KeycloakBaseService,
        KeycloakConnectModule,
        'KEYCLOAK_CLIENT_ID',
        'KEYCLOAK_REALM',
        'KEYCLOAK_REALM_CONFIG',
        'KEYCLOAK_BASE_URL',
        'KEYCLOAK_LIVE_UPSERT_REALM',
        'KEYCLOAK_CLIENT_SECRET'
      ],
    };
  }

  static forChild(options: KeycloakChildOptions): DynamicModule {
    return {
      module: KeycloakModule,
      providers: [
        KeycloakAuthService,
        KeycloakResourceService,
        {
          provide: 'KEYCLOAK_CHILD_CONFIG',
          useValue: options,
        },
      ],
      exports: [
        KeycloakAuthService,
        KeycloakResourceService,
      ]
    };
  }
}
