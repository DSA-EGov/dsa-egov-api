import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Env>);
  const logger = new Logger(bootstrap.name);

  app.useLogger(logger);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PBL API')
    .addBasicAuth()
    .addBearerAuth()
    .setVersion('0.0.1')
    .addOAuth2({
      // for keycloak
      type: 'oauth2',
      openIdConnectUrl: config.get('KEYCLOAK_AUTH_URL'),
      flows: {
        password: {
          scopes: {},
          tokenUrl: config.get('KEYCLOAK_AUTH_URL') ,
          authorizationUrl: config.get('KEYCLOAK_AUTH_URL')
        }
      }
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(config.get('SWAGGER_PATH'), app, document, {
    swaggerOptions: {

    }
  });

  await app.listen(config.get('PORT'));
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
