import { IAccessLog, IDeviceInfo } from '../interfaces';

export class CreateSessionDto {
  userId!: string;
  deviceInfo!: IDeviceInfo;
  sessionId!: string;
  status?: 'active' | 'inactive' = 'active';
  access: Omit<IAccessLog, 'createdAt'>[] = [];
}
