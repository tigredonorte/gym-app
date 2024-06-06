import { IRequestInfo } from '../request-info-middleware';

export class CreateSessionDto {
  userId!: string;
  ip!: string;
  deviceInfo!: IRequestInfo['userData']['deviceInfo'];
  location!: IRequestInfo['userData']['location'];
}
