import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventPayload } from './events.model';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(eventType: string, payload: EventPayload): Promise<Event> {
    const createdAt = new Date();
    const newEvent = new this.eventModel({ eventType, payload, createdAt });
    return newEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, eventType: string, payload: EventPayload): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(id, { eventType, payload }, { new: true }).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async delete(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  async markEventAsReadById(eventId: string, serviceName: string): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $addToSet: { readBy: serviceName } }, // Ensures idempotency
      { new: true }
    ).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
    return event;
  }

  /**
   * Watch for events of a specific type and call the provided function when they occur.
   * @param serviceName The name of the service that is watching the event
   * @param eventName The name of the event to watch for
   * @param fn The function to call when the event occurs
   */
  watch(serviceName: string, eventName: string, fn: (data: unknown, eventId: string) => void) {
    const event = this.eventModel.watch([
      { $match: { 'fullDocument.eventType': eventName } },
    ], { fullDocument: 'updateLookup' });

    event.on('change', async (change) => {
      console.log('ChangeStream event:', change);
      try {
        await fn(change.fullDocument.payload, change.fullDocument._id.toString());
        await this.markEventAsReadById(change.fullDocument._id, serviceName);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
}
