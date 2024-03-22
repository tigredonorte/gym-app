import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './events.model';
import { EventService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
