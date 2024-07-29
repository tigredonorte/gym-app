export interface IDeviceInfo {
  sessionId: string;
  updatedAt: string;
  isCurrentDevice: boolean;
  browser: { name?: string; version?: string; major?: string; };
  os: { name?: string; version?: string; };
  device: { model?: string; type?: string; vendor?: string; };
  mappedDevice: {
    browser: string;
    os: string;
    device: string;
  }
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

export interface IRequestInfo {
  ip: string;
  clientIp?: string;
  userData: {
    deviceInfo?: IDeviceInfo;
    location?: ILocation | null;
    ip?: string;
  }
}
export interface IAccessLog {
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
  status: 'active' | 'inactive';
  deviceInfo: Pick<IDeviceInfo, 'browser' | 'os' | 'device'>;
  access: IAccessLog[];
  updatedAt: string;
}

export type ISession = Omit<IFetchedSession, 'userId' | 'access' | 'deviceInfo'>;