import { Module } from '@nestjs/common';

import { appModuleImports } from './app.module.imports';
import { appModuleProviders } from './app.module.providers';

@Module({
  imports: appModuleImports,
  providers: appModuleProviders,
  controllers: [],
  exports: [],
})
export class AppModule {}
