import { Module } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { SessionModule } from './session/session.module';
import { envValidationSchema } from './validation-schemas/env.schema';

import 'dotenv/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod', '.env'],
      isGlobal: true,
      cache: process.env['NODE_ENV'] === 'production',
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env>) =>
        ({
          synchronize: config.get('NODE_ENV') === 'development',
          type: config.get('DB_TYPE'),
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          schema: config.get('DB_SCHEMA'),
          database: config.get('DB_NAME'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          entities: ['**/*.entity.js'],
        }) as any,
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/auth',
      realm: 'egov',
      clientId: 'egov-app',
      secret: '1cWw2WPAlgDvCAaYmaFCEVsyb4fXfeVS',
    }),
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    // GLOBAL LEVEL RESOURCE GUARD CHECKS FOR JWT TOKEN
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
