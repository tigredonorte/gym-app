import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventsService } from './user-events.service';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { EventModule } from '@gym-app/events';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    EventModule,
  ],
  providers: [UserService, UserEventsService],
  exports: [UserService],
})
export class UserModule {}
