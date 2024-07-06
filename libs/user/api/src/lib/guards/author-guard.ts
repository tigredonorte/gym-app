import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '../user.model';
import { UserService } from '../user.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: IUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('You are not logged in');
    }

    const id = request.params['id'] || request.params['userId'];
    if (!id) {
      throw new UnprocessableEntityException('Invalid request. Missing user id parameter');
    }

    const content = await this.userService.findById(id);
    if (!content) {
      throw new ForbiddenException('Content not found');
    }

    if (id !== user.id) {
      throw new ForbiddenException('You are not the author of this content');
    }

    return true;
  }
}
