import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from '@/entities/session.entity';
import { ResponseDto } from '@/dto/response.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  // TODO: add filtering
  public async getSessions(): Promise<ResponseDto<Session>> {
    const sessions = (await this.sessionsRepo.find({})) ?? [];

    return {
      count: sessions.length,
      data: sessions,
    };
  }

  public async createSession(): Promise<any> {}

  public async deleteSession(): Promise<any> {}

  public async updateSession(): Promise<any> {}
}
