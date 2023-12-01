import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { ModuleMetadata } from '@nestjs/common';

export const appModuleProviders: ModuleMetadata['providers'] = [
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
];
