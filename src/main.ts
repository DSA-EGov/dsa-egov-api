import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EgovEnv>);
  const logger = new Logger(bootstrap.name);

  app.useLogger(logger);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: /https?:\/\/localhost:[0-9]{1,5}/i,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: '*',
    exposedHeaders: '*',
    maxAge: 60, // cache CORS headers for 1 min
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('eGov')
    .addBearerAuth()
    .setVersion('0.0.1')
    .setDescription('eGov.AI API documentation.')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(config.get('SWAGGER_PATH'), app, document);

  await app.listen(config.get('PORT'));
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
