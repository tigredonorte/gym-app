import { QueueModule } from '@gym-app/shared/api';
import { UserWorkerModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const replicaSet = config.get('MONGO_ENABLE_REPLICA_SET') ? '&replicaSet=rs0' : '';
        const uri = `mongodb://${config.get('MONGO_USER')}:${config.get('MONGO_PASSWORD')}@${config.get('MONGO_HOST')}/${config.get('MONGO_DB')}?authSource=${config.get('MONGO_DB')}${replicaSet}`;
        const configuration = {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          replicaSet: 'rs0',
        };
        return configuration;
      },
      inject: [ConfigService],
    }),
    QueueModule,
    UserWorkerModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
