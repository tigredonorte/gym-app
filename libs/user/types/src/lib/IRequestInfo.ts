import { IUserDto } from './IUser';

export interface IDeviceInfoDto {
  browser: { name?: string; version?: string; major?: string; };
  os: { name?: string; version?: string; };
  device: { model: string | null; type: string | null; vendor: string | null; };
}
export interface IDeviceInfo extends Omit<IDeviceInfoDto, 'device'> {
  device: { model?: string; type?: string; vendor?: string; };
  sessionId: string;
  accessId: string;
  updatedAt: string;
  isCurrentDevice: boolean;
  mappedDevice: {
    browser: string;
    os: string;
    device: string;
  }
}

export interface ILocationDto {
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
export type ILocation = ILocationDto;

export interface IRequestUserDataDto {
  deviceInfo?: IDeviceInfoDto;
  location?: ILocationDto | null;
  ip?: string;
}
export interface IRequestUserData extends Omit<IRequestUserDataDto, 'deviceInfo'> {
  deviceInfo?: IDeviceInfo;
}

export interface IRequestInfoDto {
  ip: string;
  clientIp?: string;
  userData: IRequestUserDataDto,
  user?: IUserDto;
}
export interface IRequestInfo extends Omit<IRequestInfoDto, 'userData' | 'user' > {
  userData: {
    deviceInfo?: IDeviceInfo;
    location?: ILocation;
    ip?: string;
  }
}

export interface IRequestInfoWithUser extends IRequestInfoDto {
  user: IUserDto;
}
