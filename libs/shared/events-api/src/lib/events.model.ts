import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventPayload<T> = T;

@Schema()
export class Event<T> {
  @Prop({ required: true })
    eventType!: string;

  @Prop({ required: true, type: Object })
    payload!: EventPayload<T>;

  @Prop({ required: true })
    createdAt!: Date;

  @Prop({ type: [String], default: [] })
    readBy!: string[];
}

export type EventDocument<T> = Event<T> & Document;

export const EventSchema = SchemaFactory.createForClass(Event);
