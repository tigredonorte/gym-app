import { EmailModule } from '@gym-app/email';
import { EventModule } from '@gym-app/events';
import { UserModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { AuthEventListenerService } from './auth-event-listener.service';
import { AuthController } from './auth.controller';
import { AuthEventsService } from './auth.events';
import { AuthService } from './auth.service';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    EventModule,
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEventsService, AuthEventListenerService],
})
export class AuthModule {}
