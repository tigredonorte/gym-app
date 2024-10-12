import { IDeviceInfo, ILocation } from '@gym-app/user/types';

export interface IAccessLog {
  id: string;
  createdAt: string;
  updatedAt: string;
  ip: string;
  location: ILocation;
  logoutDate?: string;
  client?: string;
}

export interface IFetchedSession {
  userId: string;
  sessionId: string;
  currentAccessId: string;
  status: 'active' | 'inactive';
  deviceInfo: Pick<IDeviceInfo, 'browser' | 'os' | 'device'>;
  access: IAccessLog[];
  updatedAt: string;
}

export type ISession = Omit<IFetchedSession, 'userId' | 'access' | 'deviceInfo'>;