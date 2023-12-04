import { Module } from '@nestjs/common';

import { AiModule } from '@/ai/ai.module';

import { WsGateway } from './ws.gateway';
import { WsService } from './ws.service';

@Module({
  imports: [AiModule],
  exports: [],
  providers: [WsGateway, WsService],
  controllers: [],
})
export class WsModule {}
