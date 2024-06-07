import { EmailModule } from '@gym-app/email';
import { EventModule } from '@gym-app/events';
import { UserModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthEventListenerService } from './auth-event-listener.service';
import { AuthController } from './auth.controller';
import { AuthEventsService } from './auth.events';
import { AuthService } from './auth.service';
import { Session, SessionSchema } from './session/session.model';
import { SessionService } from './session/session.service';

@Module({
  imports: [
    UserModule, EmailModule, EventModule,
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEventsService, AuthEventListenerService, SessionService],
  
})
export class AuthModule {}
