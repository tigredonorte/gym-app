import { EventService } from '@gym-app/events';
import { UserEventPayload } from '@gym-app/user/api';
import { Injectable } from '@nestjs/common';
import { IRequestInfo } from '@gym-app/user/api';

export const AuthEventTypes = {
  login: 'authLogin',
  signup: 'authSignup',
  logout: 'authLogout',
};

@Injectable()
export class AuthEventsService {
  constructor(private eventService: EventService) {}

  emitLogout(data: { user: UserEventPayload, userData: IRequestInfo['userData'], sessionId: string }) {
    return this.eventService.create(AuthEventTypes.logout, data);
  }

  emitLogin(data: { user: UserEventPayload, userData: IRequestInfo['userData'], sessionId: string, isFirstTimeOnDevice: boolean }) {
    return this.eventService.create(AuthEventTypes.login, data);
  }

  emitSignup(data: { user: UserEventPayload, userData: IRequestInfo['userData'] }) {
    return this.eventService.create(AuthEventTypes.signup, data);
  }
}
