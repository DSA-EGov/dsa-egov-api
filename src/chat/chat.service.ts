import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ChatController } from './chat.controller';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly httpService: HttpService) {}
}
