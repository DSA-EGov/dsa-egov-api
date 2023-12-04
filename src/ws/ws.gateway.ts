import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UseInterceptors } from '@nestjs/common';
import { WebSocket } from 'ws';

import { WsLoggingInterceptor } from '@/interceptors/ws-logging.interceptor';

import { AppWsEvent } from './ws.enums';
import { WsService } from './ws.service';
import { AiQuestionDto } from '@/ai/dto/ai-question.dto';

@WebSocketGateway()
@UseInterceptors(WsLoggingInterceptor)
export class WsGateway implements OnGatewayInit {
  private readonly logger = new Logger(WsGateway.name);

  constructor(private readonly wsService: WsService) {}

  @SubscribeMessage(AppWsEvent.ECHO)
  public echo(@MessageBody() data: WsResponse): WsResponse {
    return {
      event: AppWsEvent.ECHO,
      data,
    };
  }

  @SubscribeMessage(AppWsEvent.QUESTION)
  public getQuestion(
    @MessageBody() dto: AiQuestionDto,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<void> {
    return this.wsService.question(dto, socket);
  }

  afterInit() {
    this.logger.log('Initialized');
  }
}
