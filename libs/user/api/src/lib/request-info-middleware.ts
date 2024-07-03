import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface IRequestInfo {
  ip: string;
  clientIp?: string;
  userData: {
    deviceInfo?: {
      browser: { name?: string; version?: string; major?: string; };
      os: { name?: string; version?: string; };
      device: { model?: string; type?: string; vendor?: string; };
    };
    location?: {
      range?: [number, number];
      country?: string;
      region?: string;
      eu?: '0' | '1';
      timezone?: string;
      city?: string;
      ll?: [number, number];
      metro?: number;
      area?: number;
    } | null;
    ip?: string;
  }
}

@Injectable()
export class CustomRequestInfoMiddleware implements NestMiddleware {
  use(req: IRequestInfo & Request, res: Response, next: () => void) {
    const temp = req.headers['user-agent'] || undefined;
    const ua = new UAParser(temp).getResult();
    const ip = getIp(req);
    const geo = ip ? geoip.lookup(`${ip}`) : null;

    req.userData = {
      deviceInfo: {
        browser: ua.browser,
        os: ua.os,
        device: ua.device,
      },
      location: geo,
      ip: ip,
    };
    next();
  }
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