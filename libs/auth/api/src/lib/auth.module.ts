import { EmailModule } from '@gym-app/shared/api';
import { EventModule } from '@gym-app/shared/api';
import { UserModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { AuthEventListenerService } from './auth-event-listener.service';
import { AuthController } from './auth.controller';
import { AuthEventsService } from './auth.events';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule, EmailModule, EventModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEventsService, AuthEventListenerService],

})
export class AuthModule {}
