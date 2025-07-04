import { EventService } from '@gym-app/shared/events';
import { UserEventPayload } from '@gym-app/user/api';
import { IRequestInfoDto } from '@gym-app/user/types';
import { Injectable } from '@nestjs/common';

export const AuthEventTypes = {
  login: 'auth.login',
  signup: 'auth.signup',
  logout: 'auth.logout',
};

@Injectable()
export class AuthEventsService {
  constructor(private eventService: EventService) {}

  emitLogout(data: { user: UserEventPayload, userData: IRequestInfoDto['userData'], sessionId: string }) {
    return this.eventService.create(AuthEventTypes.logout, data);
  }

  emitLogin(data: { user: UserEventPayload, userData: IRequestInfoDto['userData'], sessionId: string, isFirstTimeOnDevice: boolean }) {
    return this.eventService.create(AuthEventTypes.login, data);
  }

  emitSignup(data: { user: UserEventPayload, userData: IRequestInfoDto['userData'] }) {
    return this.eventService.create(AuthEventTypes.signup, data);
  }
}
