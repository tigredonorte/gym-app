import { IUser } from './IUser';

export interface IDeviceInfo {
  browser: { name?: string; version?: string; major?: string; };
  os: { name?: string; version?: string; };
  device: { model: string | null; type: string | null; vendor: string | null; };
}

export interface ILocation {
  range?: [number, number];
  country?: string;
  region?: string;
  eu?: '0' | '1';
  timezone?: string;
  city?: string;
  ll?: [number, number];
  metro?: number;
  area?: number;
}

export interface IRequestUserData {
  deviceInfo?: IDeviceInfo;
  location?: ILocation | null;
  ip?: string;
}

export interface IRequestInfo {
  ip: string;
  clientIp?: string;
  userData: IRequestUserData,
  user?: IUser;
}

export interface IRequestInfoWithUser extends IRequestInfo {
  user: IUser;
}
