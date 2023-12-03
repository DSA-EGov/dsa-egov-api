import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';

import { ResponseDto } from '@/dto/response.dto';
import { Session } from '@/entities/session.entity';
import type { User } from '@/types/user';

import { SessionService } from './session.service';
import { PostSessionDto } from './dto/post-session.dto';
import { ActionResponseDto } from '@/dto/action-response.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiBearerAuth()
  public getSessions(
    @AuthenticatedUser() user: User,
  ): Promise<ResponseDto<Session>> {
    return this.sessionService.getSessions(user.sub);
  }

  @Post()
  @ApiBody({ type: PostSessionDto })
  @ApiBearerAuth()
  public postSession(
    @AuthenticatedUser() user: User,
    @Body() body: PostSessionDto,
  ) {
    return this.sessionService.postSession(user.sub, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  public deleteSession(
    @AuthenticatedUser() user: User,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ): Promise<ActionResponseDto> {
    return this.sessionService.deleteSession(user.sub, sessionId);
  }

  @Put(':id')
  @ApiBearerAuth()
  public updateSession(
    @AuthenticatedUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {}
}
