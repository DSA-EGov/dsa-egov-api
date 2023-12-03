import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConnectModule, PolicyEnforcementMode, TokenValidation } from "nest-keycloak-connect";
import { ModuleMetadata } from '@nestjs/common';

import { envValidationSchema } from '@/validation-schemas/env.schema';
import { SessionModule } from '@/session/session.module';
import { WsModule } from '@/ws/ws.module';
import { ChatModule } from '@/chat/chat.module';
import { HttpModule } from '@nestjs/axios';

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
  KeycloakConnectModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService<Env>) => ({
      useNestLogger: false,
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
  SessionModule,
  WsModule,
  ChatModule,
];
