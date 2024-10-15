import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: configService.get<string>('QUEUE_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {
  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/queues');

    const { addQueue } = createBullBoard({
      queues: [],
      serverAdapter,
    });

    consumer
      .apply(serverAdapter.getRouter())
      .forRoutes('/queues');

    const queues = this.getAllQueues();
    queues.forEach((queue: Queue) => {
      addQueue(new BullAdapter(queue));
    });
  }

  getAllQueues(): Queue[] {
    return [];
  }
}
