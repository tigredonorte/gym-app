import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';

export interface IDeviceInfo extends UAParser.IResult {
  isDesktop: boolean;
}

export type ILocation = geoip.Lookup;

export interface ISession {
  userId: string;
  accessDate: Date;
  userData: {
    deviceInfo: IDeviceInfo;
    location?: ILocation;
    ip: string;
  };
}
