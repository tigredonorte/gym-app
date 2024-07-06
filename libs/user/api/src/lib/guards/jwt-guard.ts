import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '../user.model';
import { extractTokenFromHeader } from './extractTokenFromHeader';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env['JWT_SECRET'] });
      request.user = payload;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
