/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
