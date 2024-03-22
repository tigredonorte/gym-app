import { EventService } from '@gym-app/events';
import { UserEventPayload } from '@gym-app/user/api';
import { Injectable } from '@nestjs/common';
import { IRequestInfo } from './request-info-middleware';

export const AuthEventTypes = {
  login: 'authLogin',
  signup: 'authSignup',
}

@Injectable()
export class AuthEventsService {
  constructor(private eventService: EventService) {}

  emitLogin(data: { user: UserEventPayload, userData: IRequestInfo['userData'] }) {
    return this.eventService.create(AuthEventTypes.login, data);
  }

  emitSignup(data: { user: UserEventPayload, userData: IRequestInfo['userData'] }) {
    return this.eventService.create(AuthEventTypes.signup, data);
  }
}
