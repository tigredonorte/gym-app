import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { KeycloakResourceService } from './keycloak-resource.service';
import { PolicyRepresentation, RealmRepresentation, RoleRepresentation, ScopeRepresentation } from './keycloak.model';
import { KeycloakService } from './keycloak.service';

interface KeycloakRootOptions {
  realmConfig: RealmRepresentation
  clientId: string
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
    return {
      module: KeycloakModule,
      imports: [
        KeycloakConnectModule.register({
          authServerUrl: process.env.KC_HOSTNAME_INTERNAL,
          realm: process.env.REALM,
          clientId: process.env.KEYCLOAK_CLIENT_ID,
          secret: process.env.KEYCLOAK_CLIENT_SECRET,
        }),
      ],
      providers: [
        KeycloakService,
        {
          provide: 'KEYCLOAK_REALM_CONFIG',
          useValue: options.realmConfig,
        },
        {
          provide: 'KEYCLOAK_CLIENT_ID',
          useValue: options.clientId,
        },
        {
          provide: 'KEYCLOAK_REALM',
          useValue: options.realmConfig.realm,
        },
        {
          provide: 'KEYCLOAK_BASE_URL',
          useValue: `${process.env.KC_HOSTNAME_INTERNAL}:${process.env.KEYCLOAK_PORT}`,
        },
        {
          provide: 'KEYCLOAK_LIVE_UPSERT_REALM', // use this one to update realm on the fly
          useValue: options.upsertRealmOnInit ?? false,
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
        'KEYCLOAK_CLIENT_ID',
        'KEYCLOAK_REALM',
        'KEYCLOAK_BASE_URL',
        'KEYCLOAK_LIVE_UPSERT_REALM'
      ],
    };
  }

  static forChild(options: KeycloakChildOptions): DynamicModule {
    return {
      module: KeycloakModule,
      providers: [
        KeycloakResourceService,
        {
          provide: 'KEYCLOAK_CHILD_CONFIG',
          useValue: options,
        },
      ],
      exports: [KeycloakResourceService],
    };
  }
}
