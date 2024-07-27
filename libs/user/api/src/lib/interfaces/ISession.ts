import { IDeviceInfo, ILocation } from './IRequestInfo';

export interface IAccessLog {
  createdAt: Date;
  ip: string;
  location: ILocation;
  logoutDate?: Date;
}

export type AccessLogType = Omit<IAccessLog, 'createdAt'>;

export interface ISession {
  userId: string;
  deviceInfo: IDeviceInfo;
  sessionId: string;
  status: 'active' | 'inactive';
  access: IAccessLog[];
  createdAt?: Date;
  updatedAt?: Date;
}