import { IRequestInfo } from '../request-info-middleware';

export class AccessLog {
  createdAt!: Date;
  ip!: string;
  location!: IRequestInfo['userData']['location'];
  logoutDate?: Date;
}

export class CreateSessionDto {
  userId!: string;
  deviceInfo!: IRequestInfo['userData']['deviceInfo'];
  sessionId!: string;
  status?: 'active' | 'inactive' = 'active';
  access: AccessLog[] = [];
}
