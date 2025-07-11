import { logger } from '@gym-app/shared/api';
import { KeycloakAuthService } from '@gym-app/keycloak';
import { IRequestInfoDto, IUser, IUserDataInfo } from '@gym-app/user/types';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { extractTokenFromHeader } from './guards/extractTokenFromHeader';

@Injectable()
export class CustomRequestInfoMiddleware implements NestMiddleware {
  constructor(private readonly keycloakAuthService: KeycloakAuthService) {}

  use(req: IRequestInfoDto & Request, res: Response, next: () => void) {
    req.userData = getUserData(req);
    const user = getUser(req, this.keycloakAuthService);
    req.user = user || undefined;
    next();
  }
}

function getUser(req: IRequestInfoDto & Request, keycloakAuthService: KeycloakAuthService): IUser | null {
  const token = extractTokenFromHeader(req);
  if (!token) {
    return null;
  }

  try {
    const decoded = keycloakAuthService.verifyToken(token);
    if (!decoded) {
      return null;
    }

    if (!decoded.sub || !decoded['email'] || !decoded['name']) {
      throw new Error('Invalid token structure');
    }

    return {
      id: decoded.sub,
      email: decoded['email'],
      name: decoded['name'],
      blocked: decoded['blocked'] || false,
      confirmed: decoded['email_verified'],
    };
  } catch (e) {
    logger.error('Failed to verify token:\n', e);
    return null;
  }
}

function getUserData(req: IRequestInfoDto & Request): IRequestInfoDto['userData'] {
  const temp = req.headers['user-agent'] || undefined;
  const ua = new UAParser(temp).getResult();
  const ip = getIp(req);
  const geo = ip ? geoip.lookup(`${ip}`) : null;
  return {
    deviceInfo: {
      browser: ua.browser,
      os: ua.os,
      device: {
        vendor: ua.device.vendor || null,
        model: ua.device.model || null,
        type: ua.device.type || null,
      }
    },
    location: geo,
    ip: ip,
  };
}

function getIp(req: Request & IRequestInfoDto): string | undefined {
  if (req.clientIp) {
    return req.clientIp;
  }

  if (req.ip) {
    return req.ip;
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const ips = forwarded.split(',');
    return ips[0];
  } else if (Array.isArray(forwarded)) {
    return forwarded[0];
  }

  return undefined;
}

export function getUserAccessData(userData: IRequestInfoDto['userData']): IUserDataInfo {
  const location = userData.location ? `${userData.location?.city}, ${userData.location?.region}, ${userData.location?.country}`: '';
  const browser = `${userData.deviceInfo?.browser?.name} ${userData.deviceInfo?.browser?.major }`;
  const os = `${userData.deviceInfo?.os?.name} ${userData.deviceInfo?.os?.version}`;
  const device = `${userData.deviceInfo?.device?.vendor} ${userData.deviceInfo?.device?.model}`;
  return { browser, location, os, device };
}