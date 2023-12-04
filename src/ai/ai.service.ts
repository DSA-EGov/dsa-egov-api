import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import type { AiQuestion } from './ai.types';
import { AiResponse } from './ai.types';
import { firstValueFrom } from 'rxjs';
import { ChatService } from '@/chat/chat.service';
import { AiQuestionDto } from '@/ai/dto/ai-question.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EgovEnv>,
    private readonly chatService: ChatService,
  ) {}

  public async sendQuestion(dto: AiQuestionDto): Promise<string> {
    try {
      const questionId = await this.chatService.postQuestion(
        dto.userId,
        dto.sessionId,
        dto.text,
      );

      const req = await firstValueFrom(
        this.httpService.post<AiResponse>(
          this.configService.get('AZURE_EGOV_URL'),
          {
            top: 1,
            question: dto.text,
          } as AiQuestion,
          {
            headers: {
              [this.configService.get('AZURE_EGOV_HEADER')]:
                this.configService.get('AZURE_EGOV_KEY'),
            },
          },
        ),
      );

      const answer = req.data.answers[0].answer
      await this.chatService.postAnswer(questionId, answer);

      this.logger.debug(dto.text + ': ' + answer);

      return answer;
    } catch (err) {
      console.error(err);
    }
  }
}
