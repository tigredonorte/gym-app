import { IRequestInfoDto } from '@gym-app/user/types';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { setSession } from './logger.metrics';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  async use(req: IRequestInfoDto & Request, res: Response, next: NextFunction) {
    await setSession({
      userId: req?.user?.id,
      sessionId: req?.headers?.['session-id']?.toString(),
      accessId: req?.headers?.['access-id']?.toString(),
      requestId: randomUUID().slice(0, 8),
    });
    next();
  }
}

