import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IUser } from '../interfaces/IUser';
import { UserService } from '../user.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
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
