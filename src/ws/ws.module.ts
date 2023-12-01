import { Module } from '@nestjs/common';

import { WsGateway } from './ws.gateway';

@Module({
  imports: [],
  exports: [],
  providers: [WsGateway],
  controllers: [],
})
export class WsModule {}
