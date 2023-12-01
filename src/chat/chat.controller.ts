import { Controller, Logger } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor() {}
}
