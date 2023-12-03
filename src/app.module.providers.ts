import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'nest-keycloak-connect';
import { ModuleMetadata } from '@nestjs/common';

export const appModuleProviders: ModuleMetadata['providers'] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];
