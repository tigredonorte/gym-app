import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IDeviceInfo, ILocation, ISession } from './session.interfaces';

@Schema()
export class Location implements ILocation {
  
  @Prop({ type: [Number], required: false })
  range!: [number, number];

  @Prop({ required: false })
  country!: string;

  @Prop({ required: false })
  region!: string;

  @Prop({ required: false })
  eu!: "1" | "0";

  @Prop({ required: false })
  timezone!: string;

  @Prop({ required: false })
  city!: string;

  @Prop({ type: [Number], required: false })
  ll!: [number, number];

  @Prop({ required: false })
  metro!: number;

  @Prop({ required: false })
  area!: number;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
export class DeviceInfo implements IDeviceInfo {
  @Prop({ required: true })
  ua!: string;

  @Prop(raw({
    name: { type: String, required: true },
    version: { type: String, required: true },
    major: { type: String, required: true },
  }))
  browser!: IDeviceInfo['browser'];

  @Prop(raw({
    name: { type: String, required: true },
    version: { type: String, required: true },
  }))
  engine!: IDeviceInfo['engine'];

  @Prop(raw({
    name: { type: String, required: true },
    version: { type: String, required: true },
  }))
  os!: IDeviceInfo['os'];

  @Prop(raw({
    model: { type: String, required: false },
    type: { type: String, required: false },
    vendor: { type: String, required: false },
  }))
  device!: IDeviceInfo['device'];

  @Prop(raw({
    architecture: { type: String, required: true }
  }))
  cpu!: IDeviceInfo['cpu'];

  @Prop({ required: true })
  isDesktop!: boolean;
}

const DeviceInfoSchema = SchemaFactory.createForClass(DeviceInfo);

@Schema()
export class Session {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  accessDate!: Date;

  @Prop(raw({
    deviceInfo: { type: DeviceInfoSchema, required: true },
    location: { type: LocationSchema, required: false },
    ip: { type: String, required: true },
  }))
  userData!: {
    deviceInfo: DeviceInfo;
    location?: Location;
    ip: string;
  };
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export type SessionDocument = ISession & Document;
