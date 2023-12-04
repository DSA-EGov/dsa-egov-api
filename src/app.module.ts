import { Module } from '@nestjs/common';

import { appModuleImports } from './app.module.imports';
import { appModuleProviders } from './app.module.providers';
import { AiModule } from './ai/ai.module';

@Module({
  imports: appModuleImports,
  providers: appModuleProviders,
  controllers: [],
  exports: [],
})
export class AppModule {}
