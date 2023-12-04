import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { WsResponse } from '@nestjs/websockets';

import { AiService } from '@/ai/ai.service';
import { AiResponse } from '@/ai/ai.types';
import { AiQuestionDto } from '@/ai/dto/ai-question.dto';

import { AppWsEvent } from './ws.enums';

@Injectable()
export class WsService {
  private readonly logger = new Logger(WsService.name);

  constructor(private readonly aiService: AiService) {}

  public async question(dto: AiQuestionDto, socket: WebSocket): Promise<void> {
    const res = await this.aiService.sendQuestion(dto);

    socket.send(
      JSON.stringify({
        data: res,
        event: AppWsEvent.ANSWER,
      } as WsResponse<AiResponse>),
    );
  }
}
