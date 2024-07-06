import { Request } from 'express';

export function extractTokenFromHeader(request: Request): string | null {
  const authorization = request.headers['authorization'] || request.headers['Authorization'];
  if (!authorization || typeof authorization !== 'string') {
    return null;
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return null;
  }
  return token;
}
