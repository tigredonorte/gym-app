import { KeycloakModule } from '@gym-app/keycloak';
import { EmailModule, QueueModule } from '@gym-app/shared/api';
import { EventModule } from '@gym-app/shared/events';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEventsService } from './user-events.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
    EventModule,
    QueueModule,
    KeycloakModule
  ],
  controllers: [UserController],
  providers: [UserService, UserEventsService],
  exports: [UserService],
})
export class UserModule {}
