import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger, UseInterceptors } from '@nestjs/common';

import { WsLoggingInterceptor } from '@/interceptors/ws-logging.interceptor';

import { AppWsEvent } from './ws.enums';

@WebSocketGateway()
@UseInterceptors(WsLoggingInterceptor)
export class WsGateway implements OnGatewayInit {
  private readonly logger = new Logger(WsGateway.name);

  constructor() {}

  @SubscribeMessage(AppWsEvent.ECHO)
  echo(@MessageBody() data: WsResponse): WsResponse {
    return {
      event: AppWsEvent.ECHO,
      data,
    };
  }

  afterInit() {
    this.logger.log('Initialized');
  }
}
