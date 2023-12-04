import { Controller, Get, Logger, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';

import { ResponseDto } from '@/dto/response.dto';
import type { User } from '@/types/user';

import { QuestionDto } from './dto/question.dto';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Get('/get/:sessionId')
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBearerAuth()
  public getQuestions(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @AuthenticatedUser() user: User,
  ): Promise<ResponseDto<QuestionDto>> {
    return this.chatService.getQuestions(sessionId, user.sub);
  }
}
