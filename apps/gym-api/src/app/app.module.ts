import { AuthModule } from '@gym-app/auth/api';
import { KeycloakModule } from '@gym-app/keycloak';
import { MetricsModule, QueueModule, SessionMiddleware } from '@gym-app/shared/api';
import { EventModule } from '@gym-app/shared/events';
import { CustomRequestInfoMiddleware, UserModule } from '@gym-app/user/api';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import * as requestIp from 'request-ip';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getRealmConfig } from './realm.config';

const realmConfig = getRealmConfig();
@Module({
  imports: [
    AuthModule,
    UserModule,
    MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_URI: Joi.string(),
        MONGO_ENABLE_REPLICA_SET: Joi.string(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        QUEUE_NAME: Joi.string().required(),
        KEYCLOAK_CLIENT_ID: Joi.string().required(),
        KEYCLOAK_REALM: Joi.string().required(),
      }),
    }),
    QueueModule,
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
    KeycloakModule.forRoot({
      realmConfig,
      upsertRealmOnInit: false,
      client: realmConfig.clients.find((client) => client.clientId === 'backend-client'),
    }),
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(requestIp.mw(), CustomRequestInfoMiddleware, SessionMiddleware)
      .forRoutes('*');
  }
}
