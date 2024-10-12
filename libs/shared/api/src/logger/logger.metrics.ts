import { createNamespace, getNamespace } from 'cls-hooked';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const session = createNamespace('loggerNamespace');

type ISessionKeys = 'userId' | 'sessionId' | 'accessId' | 'requestId';

export const getSession = () => {
  const currentNamespace = getNamespace('loggerNamespace');
  if (currentNamespace && currentNamespace.active) {
    return {
      userId: currentNamespace.get('userId'),
      sessionId: currentNamespace.get('sessionId'),
      accessId: currentNamespace.get('accessId'),
      requestId: currentNamespace.get('requestId'),
    };
  }
  return {};
};

export const setSession = (requestTypes: Record<ISessionKeys, string | undefined>) => {
  return new Promise<void>((resolve) => {
    const currentNamespace = getNamespace('loggerNamespace');

    if (currentNamespace && currentNamespace.active) {
      Object.keys(requestTypes).forEach((key) => {
        const value = requestTypes[key as ISessionKeys];
        if (value) {
          currentNamespace.set(key, value);
        }
      });
      return resolve();
    }

    session.run(() => {
      Object.keys(requestTypes).forEach((key) => {
        const value = requestTypes[key as ISessionKeys];
        if (value) {
          session.set(key, value);
        }
      });

      resolve();
    });
  });
};

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  session.run(() => {
    const requestId = randomUUID();
    session.set('requestId', requestId.slice(0, 8));
    next();
  });
};