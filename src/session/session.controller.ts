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
import type { User } from '@/types/user';
import { ActionResponseDto } from '@/dto/action-response.dto';

import { PostSessionDto, SessionDto, UpdateSessionDto } from './dto';
import { SessionService } from './session.service';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiBearerAuth()
  public getSessions(
    @AuthenticatedUser() user: User,
  ): Promise<ResponseDto<SessionDto>> {
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
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateSessionDto })
  public updateSession(
    @AuthenticatedUser() user: User,
    @Param('id', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpdateSessionDto,
  ): Promise<SessionDto> {
    return this.sessionService.updateSession(user.sub, sessionId, dto);
  }
}
