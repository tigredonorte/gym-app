import { IDeviceInfoDto, ILocationDto } from './IRequestInfo';

export interface IAccessLog {
  // _id: string;
  createdAt: Date;
  ip: string;
  location: ILocationDto;
  logoutDate?: Date;
}

export type AccessLogType = Omit<IAccessLog, 'createdAt' | '_id'>;

export enum SessionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface ISession {
  userId: string;
  deviceInfo: IDeviceInfoDto;
  sessionId: string;
  status: SessionStatus;
  access: IAccessLog[];
  currentAccessId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
