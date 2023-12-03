import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { SessionService } from './session.service';
import { ApiOAuth2, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '@/dto/response.dto';
import { Session } from '@/entities/session.entity';
import { AuthenticatedUser } from "nest-keycloak-connect";

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiOperation({})
  @Get('get')
  @HttpCode(HttpStatus.OK)
  @ApiOAuth2(['profile'])
  public getSessions(@AuthenticatedUser() user: any): Promise<ResponseDto<Session>> {
    console.log(user)
    return this.sessionService.getSessions();
  }
}
