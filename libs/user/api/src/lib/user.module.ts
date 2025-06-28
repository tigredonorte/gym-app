import { KeycloakModule } from '@gym-app/keycloak';
import { EmailModule, EventModule, QueueModule } from '@gym-app/shared/api';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule,
    QueueModule,
    KeycloakModule
  ],
  controllers: [UserController],
  providers: [UserService, UserEventsService],
  exports: [UserService, JwtModule],
})
export class UserModule {}
