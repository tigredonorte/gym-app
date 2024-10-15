import { QueueModule } from '@gym-app/shared/api';
import { UserWorkerModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QueueModule,
    UserWorkerModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
