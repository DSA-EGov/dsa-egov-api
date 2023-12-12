import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import type { AiQueryAnswer, AiQuestion } from './ai.types';
import { AiResponse } from './ai.types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EgovEnv>,
  ) {}

  public async queryAnswer(dto: AiQueryAnswer): Promise<string> {
    try {
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
            timeout: 10_000,
          },
        ),
      );

      return req.data.answers[0].answer;
    } catch (err) {
      console.error(err);
    }
  }
}
