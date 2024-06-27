import { EventModule } from '@gym-app/events';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventsService } from './user-events.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    EventModule,
    JwtModule
  ],
  controllers: [UserController],
  providers: [UserService, UserEventsService],
  exports: [UserService],
})
export class UserModule {}
