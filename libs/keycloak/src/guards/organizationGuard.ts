import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { KeycloakResourceService } from '../lib/keycloak-resource.service';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private keycloakResourceService: KeycloakResourceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    const resource = await this.keycloakResourceService.getResourceById(resourceId);

    return user.organizationId === resource.attributes.organizationId;
  }
}
