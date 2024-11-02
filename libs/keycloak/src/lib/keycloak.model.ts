/* eslint-disable @typescript-eslint/no-explicit-any */

// Removed the import of KeycloakAdminClient
// import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

export enum DecisionStrategy {
  AFFIRMATIVE = 'AFFIRMATIVE',
  UNANIMOUS = 'UNANIMOUS',
  CONSENSUS = 'CONSENSUS',
}

export enum DecisionEffect {
  Permit = 'PERMIT',
  Deny = 'DENY',
}

export enum Logic {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export interface PolicyRoleRepresentation {
  id: string;
  required?: boolean;
}

export interface PolicyRepresentation {
  config?: Record<string, any>;
  decisionStrategy?: DecisionStrategy;
  description?: string;
  id?: string;
  logic?: Logic;
  name?: string;
  owner?: string;
  policies?: string[];
  resources?: string[];
  scopes?: string[];
  type?: string;
  users?: string[];
  roles?: PolicyRoleRepresentation[];
}

export interface ClientRepresentation {
  id?: string;
  clientId?: string;
  secret?: string;
  rootUrl?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  clientAuthenticatorType?: string;
  redirectUris?: string[];
  webOrigins?: string[];
  protocol?: string;
  attributes?: { [key: string]: any };
  publicClient?: boolean;
  serviceAccountsEnabled?: boolean;
  standardFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  implicitFlowEnabled?: boolean;
  bearerOnly?: boolean;
  consentRequired?: boolean;
}

export interface GroupRepresentation {
  id?: string;
  name?: string;
  path?: string;
  subGroups?: GroupRepresentation[];
  attributes?: { [key: string]: string[] };
  [propName: string]: any;
}

export interface IdentityProviderRepresentation {
  internalId?: string;
  providerId?: string;
  alias?: string;
  displayName?: string;
  enabled?: boolean;
  updateProfileFirstLoginMode?: string;
  trustEmail?: boolean;
  storeToken?: boolean;
  addReadTokenRoleOnCreate?: boolean;
  authenticateByDefault?: boolean;
  linkOnly?: boolean;
  firstBrokerLoginFlowAlias?: string;
  postBrokerLoginFlowAlias?: string;
  config?: { [key: string]: string };
  [propName: string]: any;
}

export interface RealmRepresentation {
  id?: string;
  realm?: string;
  displayName?: string;
  enabled?: boolean;
  sslRequired?: string;
  registrationAllowed?: boolean;
  registrationEmailAsUsername?: boolean;
  resetPasswordAllowed?: boolean;
  editUsernameAllowed?: boolean;
  smtpServer?: SmtpServerRepresentation;
  [propName: string]: any;
}

export interface SmtpServerRepresentation {
  password?: string;
  port?: string;
  auth?: string;
  host?: string;
  from?: string;
  fromDisplayName?: string;
  replyTo?: string;
  replyToDisplayName?: string;
  envelopeFrom?: string;
  ssl?: string;
  starttls?: string;
  user?: string;
  [key: string]: string | undefined;
}

export interface RoleRepresentation {
  id?: string;
  name?: string;
  description?: string;
  scopeParamRequired?: boolean;
  composite?: boolean;
  composites?: {
    realm?: string[];
    client?: { [key: string]: string[] };
    application?: { [key: string]: string[] };
  };
  clientRole?: boolean;
  containerId?: string;
  attributes?: { [key: string]: string[] };
  [propName: string]: any;
}

export interface UserRepresentation {
  id?: string;
  username?: string;
  email?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  attributes?: { [key: string]: string[] };
  credentials?: CredentialRepresentation[];
  [propName: string]: any;
}

export interface CredentialRepresentation {
  type?: string;
  value?: string;
  temporary?: boolean;
  [propName: string]: any;
}

export interface ResourceRepresentation {
  id?: string;
  name?: string;
  displayName?: string;
  type?: string;
  owner?: { id?: string; name?: string };
  ownerManagedAccess?: boolean;
  scopes?: ScopeRepresentation[];
  uris?: string[];
  attributes?: { [key: string]: string[] };
  [propName: string]: any;
}

export interface ScopeRepresentation {
  id?: string;
  name?: string;
  displayName?: string;
  iconUri?: string;
  [propName: string]: any;
}

export enum RoleType {
  admin = 'admin',
  manager = 'manager',
  user = 'user',
}

export enum GroupConfigEnum {
  admin = 'Admin',
  manager = 'Manager',
  user = 'User',
}

export interface IKeycloakLoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}
