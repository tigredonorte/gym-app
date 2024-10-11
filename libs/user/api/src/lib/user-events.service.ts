import { EventService, NotificationGateway } from '@gym-app/shared/api';
import { Injectable } from '@nestjs/common';
import { UserReturnType } from './interfaces';

export const UserEventTypes = {
  created: 'user.created',
  deleted: 'user.deleted',
  edited: 'user.edited',
};

export const UserEventChannels = {
  created: 'userList.created',
  deleted: 'userList.deleted',
  edited: 'userList.edited',
};

export interface UserEventPayload {
  name: string;
  email: string;
  id: string;
  token?: string;
}

@Injectable()
export class UserEventsService {
  constructor(
    private eventService: EventService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  emitUserCreated(user: Partial<UserReturnType>) {
    this.notificationGateway.emitToChannel(UserEventChannels.created, user);
    return this.eventService.create(UserEventTypes.created, user);
  }

  emitUserDeleted(user: UserEventPayload) {
    this.notificationGateway.emitToChannel(UserEventChannels.deleted, user.id);
    return this.eventService.create(UserEventTypes.deleted, user);
  }

  emitUserEdited(user: Partial<UserReturnType>) {
    this.notificationGateway.emitToChannel(UserEventChannels.edited, user);
    this.notificationGateway.emitToChannel(this.getEventName(user.id as string, UserEventTypes.edited), user);
  }

  emitPasswordChanged(id: string) {
    return this.notificationGateway.emitToChannel(`user.${id}.passwordChanged`, { id });
  }

  getEventName(id: string, event: string) {
    return event.split('.').splice(1, 0, id).join('.');
  }
}