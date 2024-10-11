import { EmailModule } from '@gym-app/shared/api';
import { EventModule } from '@gym-app/events';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './guards';
import { Session, SessionSchema, SessionService } from './session';
import { SessionEventsService } from './session/session-events.service';
import { UserEventsService } from './user-events.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    EmailModule,
    EventModule,
    JwtModule
  ],
  controllers: [UserController],
  providers: [UserService, UserEventsService, SessionService, JwtAuthGuard, SessionEventsService],
  exports: [SessionService, UserService, JwtAuthGuard, JwtModule],
})
export class UserModule {}
