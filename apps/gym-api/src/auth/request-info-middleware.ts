import { Injectable, NestMiddleware, Next, Request } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface IRequestInfo extends Request {
  clientIp?: string;
  ip?: string;
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
      eu?: "0" | "1";
      timezone?: string;
      city?: string;
      ll?: [number, number];
      metro?: number;
      area?: number;
    };
    ip?: string;
  }
}

@Injectable()
export class CustomRequestInfoMiddleware implements NestMiddleware {
  use(req: IRequestInfo, res: Response, next: Function) {
    const ua = new UAParser(req.headers['user-agent']).getResult();
    const ip = req.clientIp || req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    const geo = geoip.lookup(ip);

    req.userData = {
      deviceInfo: {
        browser: ua.browser,
        os: ua.os,
        device: ua.device,
      },
      location: geo,
      ip: ip,
    }
    next();
  }
}