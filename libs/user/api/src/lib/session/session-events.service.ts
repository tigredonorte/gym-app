import { EventService } from '@gym-app/events';
import { Injectable } from '@nestjs/common';

export const SessionEventTypes = {
  logout: ['session', 'logout'],
};

export interface SessionEventPayload {
  sessionId: string;
  userId: string;
  accessId: string;
  requestUserId: string;
}

@Injectable()
export class SessionEventsService {
  constructor(private eventService: EventService) {}

  emitLogoutDevice(session: SessionEventPayload) {
    return this.eventService.create(`session.${session.accessId}.logout`, session);
  }

}