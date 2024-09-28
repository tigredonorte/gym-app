import { AuthModule } from '@gym-app/auth/api';
import { EventModule } from '@gym-app/events';
import { UserModule } from '@gym-app/user/api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_URI: Joi.string(),
        MONGO_ENABLE_REPLICA_SET: Joi.string(),
      }),
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
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
