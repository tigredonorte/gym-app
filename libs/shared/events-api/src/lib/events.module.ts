import { KeycloakModule } from '@gym-app/keycloak';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './events.model';
import { EventService } from './events.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    KeycloakModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],
  providers: [EventService, NotificationGateway],
  exports: [EventService, NotificationGateway],
})
export class EventModule {}
