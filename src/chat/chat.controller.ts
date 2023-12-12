import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';

import type { User } from '@/types/user';

import { QuestionDto } from './dto/question.dto';
import { ChatService } from './chat.service';
import { PostQuestionDto } from './dto/post-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/get/:sessionId')
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBearerAuth()
  public getQuestions(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @AuthenticatedUser() user: User,
  ): Promise<QuestionResponseDto> {
    return this.chatService.getQuestions(sessionId, user.sub);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: PostQuestionDto })
  public postQuestion(
    @AuthenticatedUser() user: User,
    @Body() dto: PostQuestionDto,
  ): Promise<QuestionDto> {
    return this.chatService.postQuestion(dto, user.sub);
  }
}
