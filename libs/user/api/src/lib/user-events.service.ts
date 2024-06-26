import { EventService } from '@gym-app/events';
import { Injectable } from '@nestjs/common';

export interface UserEventPayload {
  name: string;
  email: string;
  id: string;
  token?: string;
}

@Injectable()
export class UserEventsService {
  constructor(private eventService: EventService) {}

  emitUserCreated(user: UserEventPayload) {
    return this.eventService.create('userCreated', user);
  }

  emitUserDeleted(user: UserEventPayload) {
    return this.eventService.create('userDeleted', user);
  }
}