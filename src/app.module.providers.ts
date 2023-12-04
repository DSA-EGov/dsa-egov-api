import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from 'nest-keycloak-connect';
import { ModuleMetadata, ValidationPipe } from '@nestjs/common';

export const appModuleProviders: ModuleMetadata['providers'] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      transform: true,
      always: true,
      enableDebugMessages: process.env.NODE_ENV === 'development',
    }),
  },
];
