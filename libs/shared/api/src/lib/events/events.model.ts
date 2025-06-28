import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventPayload = Record<string, any>;

@Schema()
export class Event {
  @Prop({ required: true })
    eventType!: string;

  @Prop({ required: true, type: Object })
    payload!: EventPayload;

  @Prop({ required: true })
    createdAt!: Date;

  @Prop({ type: [String], default: [] })
    readBy!: string[];
}

export type EventDocument = Event & Document;

export const EventSchema = SchemaFactory.createForClass(Event);
