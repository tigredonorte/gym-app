import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { extractTokenFromHeader } from './guards/extractTokenFromHeader';
import { IRequestInfo, IUser } from './interfaces';

@Injectable()
export class CustomRequestInfoMiddleware implements NestMiddleware {
  use(req: IRequestInfo & Request, res: Response, next: () => void) {
    req.userData = getUserData(req);
    const user = getUser(req, new JwtService());
    req.user = user || undefined;
    next();
  }
}

function getUser(req: IRequestInfo & Request, jwtService: JwtService): IUser | null {
  const token = extractTokenFromHeader(req);
  if (!token) {
    return null;
  }

  try {
    const payload = jwtService.verify(token, { secret: process.env['JWT_SECRET'] });
    return payload;
  } catch (e) {
    return null;
  }
}

function getUserData(req: IRequestInfo & Request): IRequestInfo['userData'] {
  const temp = req.headers['user-agent'] || undefined;
  const ua = new UAParser(temp).getResult();
  const ip = getIp(req);
  const geo = ip ? geoip.lookup(`${ip}`) : null;
  return {
    deviceInfo: {
      browser: ua.browser,
      os: ua.os,
      device: ua.device,
    },
    location: geo,
    ip: ip,
  };
}

function getIp(req: Request & IRequestInfo): string | undefined {
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

export interface IUserDataInfo {
  browser: string;
  location: string;
  os: string;
  device: string;
}

export function getUserAccessData(userData: IRequestInfo['userData']): IUserDataInfo {
  const location = userData.location ? `${userData.location?.city}, ${userData.location?.region}, ${userData.location?.country}`: '';
  const browser = `${userData.deviceInfo?.browser?.name} ${userData.deviceInfo?.browser?.major }`;
  const os = `${userData.deviceInfo?.os?.name} ${userData.deviceInfo?.os?.version}`;
  const device = `${userData.deviceInfo?.device?.vendor} ${userData.deviceInfo?.device?.model}`;
  return { browser, location, os, device };
}