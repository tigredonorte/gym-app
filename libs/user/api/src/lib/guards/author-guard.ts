import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('You are not logged in');
    }

    const { id, userId } = request.params;
    const _id = id || userId;
    if (!id) {
      throw new UnprocessableEntityException('Invalid request. Missing user id parameter');
    }

    const content = await this.userService.findById(_id);
    if (!content) {
      throw new ForbiddenException('Content not found');
    }

    return true;
  }
}
