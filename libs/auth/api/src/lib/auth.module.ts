import { EmailModule } from '@gym-app/email';
import { EventModule } from '@gym-app/events';
import { UserModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { AuthEventListenerService } from './auth-event-listener.service';
import { AuthController } from './auth.controller';
import { AuthEventsService } from './auth.events';
import { AuthService } from './auth.service';
import { SessionService } from './session/session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './session/session.model';

@Module({
  imports: [
    UserModule, EmailModule, EventModule,
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEventsService, AuthEventListenerService, SessionService],
  
})
export class AuthModule {}
