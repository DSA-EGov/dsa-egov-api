import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  KeycloakConnectModule,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';
import { ModuleMetadata } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

import { envValidationSchema } from '@/validation-schemas/env.schema';
import { SessionModule } from '@/session/session.module';
import { ChatModule } from '@/chat/chat.module';

export const appModuleImports: ModuleMetadata['imports'] = [
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
    inject: [ConfigService],
    useFactory: (config: ConfigService<EgovEnv>) => ({
      synchronize: config.get('NODE_ENV') === 'development',
      type: config.get('DB_TYPE') as any, // type error
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      schema: config.get('DB_SCHEMA'),
      database: config.get('DB_NAME') as string, // UInt8Array type error
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
    }),
  }),
  KeycloakConnectModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService<EgovEnv>) => ({
      useNestLogger: true,
      authServerUrl: config.get('KEYCLOAK_AUTH_URL'),
      realm: config.get('KEYCLOAK_REALM'),
      clientId: config.get('KEYCLOAK_CLIENT_ID'),
      secret: config.get('KEYCLOAK_SECRET'),
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
      tokenValidation: TokenValidation.OFFLINE,
    }),
  }),
  HttpModule.registerAsync({
    useFactory: () => ({
      maxRedirects: 1, // increase if problems appear
      withXSRFToken: false, // we use jwt for that
      adapter: 'http', // force axios to use http fetch
      timeout: 5000,
    }),
  }),
  ServeStaticModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EgovEnv>) => [
      {
        rootPath: path.join(__dirname, configService.get('UI_BUILD_PATH')),
        serveStaticOptions: {
          cacheControl: configService.get('NODE_ENV') === 'production',
          maxAge: configService.get('NODE_ENV') === 'production' ? 60 : 0,
        },
      },
    ],
  }),

  SessionModule,
  ChatModule,
];
