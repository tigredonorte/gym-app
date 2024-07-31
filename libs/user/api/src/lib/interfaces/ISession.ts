import { IDeviceInfo, ILocation } from './IRequestInfo';

export interface IAccessLog {
  _id: string;
  createdAt: Date;
  ip: string;
  location: ILocation;
  logoutDate?: Date;
}

export type AccessLogType = Omit<IAccessLog, 'createdAt' | '_id'>;

export interface ISession {
  userId: string;
  deviceInfo: IDeviceInfo;
  sessionId: string;
  status: 'active' | 'inactive';
  access: IAccessLog[];
  createdAt?: Date;
  updatedAt?: Date;
}