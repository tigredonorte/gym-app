import { EmailModule, QueueModule } from '@gym-app/shared/api';
import { Module } from '@nestjs/common';
import { UserEmailWorker } from './user.email.worker';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    QueueModule,
    ConfigModule,
    EmailModule,
  ],
  controllers: [],
  providers: [UserEmailWorker],
  exports: [UserEmailWorker],
})
export class UserWorkerModule {}
