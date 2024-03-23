import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export interface IRequestInfo {
  ip: string;
  clientIp?: string;
  userData: {
    deviceInfo?: UAParser.IResult & {
      isDesktop: boolean;
    };
    location?: geoip.Lookup | null;
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
        ...ua,
        isDesktop: !temp ? false : isDesktopUserAgent(temp),
      },
      location: geo,
      ip: ip,
    }
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

function isDesktopUserAgent(userAgent: string): boolean {
  // Patterns that usually indicate a mobile device
  const mobileIndicators = [
    'Mobile', 
    'Android', 
    'Silk/', 
    'Kindle', 
    'BlackBerry', 
    'Opera Mini', 
    'Opera Mobi'
  ];
  
  // Simple check for common desktop OS parts in the UA string
  const desktopIndicators = [
    'Windows NT', 
    'Macintosh', 
    'Mac OS X', 
    'X11', 
    'Linux'
  ];
  
  // Check for desktop indicators
  const isLikelyDesktop = desktopIndicators.some(indicator => userAgent.includes(indicator));
  
  // Check for mobile indicators
  const isLikelyMobile = mobileIndicators.some(indicator => userAgent.includes(indicator));
  
  // Considered desktop if likely desktop and not likely mobile
  return isLikelyDesktop && !isLikelyMobile;
}