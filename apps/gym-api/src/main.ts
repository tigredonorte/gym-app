import { MetricsInterceptor, MetricsService, SessionMiddleware } from '@gym-app/shared/api';
import { CustomRequestInfoMiddleware } from '@gym-app/user/api';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as requestIp from 'request-ip';
import { AppModule } from './app/app.module';
import { getMorgan } from './middlewares/getMorgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['fatal', 'error', 'warn', 'log', 'debug']
  });
  const config = new DocumentBuilder()
    .setTitle('Gym App API')
    .setDescription('API documentation for the Gym App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(getMorgan());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  app.use(requestIp.mw());
  app.use(new CustomRequestInfoMiddleware().use);
  app.use(new SessionMiddleware().use);
  app.useGlobalInterceptors(new MetricsInterceptor(app.get(MetricsService)));
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Automatically remove non-whitelisted properties
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
