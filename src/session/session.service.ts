import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Session } from '@/entities/session.entity';
import { ResponseDto } from '@/dto/response.dto';
import { ActionResponseDto } from '@/dto/action-response.dto';

import { PostSessionDto } from './dto/post-session.dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  public async getSessions(userId: string): Promise<ResponseDto<Session>> {
    let sessions = await this.sessionsRepo.find({
      where: { userId },
      skip: 0, // TODO: add filtering
      take: 999,
    });

    sessions ??= [];

    return {
      count: sessions.length,
      data: sessions,
    };
  }

  public async postSession(
    userId: string,
    body: PostSessionDto,
  ): Promise<Session> {
    const session = this.sessionsRepo.create();
    session.name = body.name;
    session.userId = userId;

    await this.sessionsRepo.save(session);

    return session;
  }

  public async deleteSession(
    userId: string,
    sessionId: string,
  ): Promise<ActionResponseDto> {
    const session = await this.sessionsRepo.findOneBy({ id: sessionId });

    if (!session) {
      throw new NotFoundException();
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException();
    }

    const result = await this.sessionsRepo.remove(session);

    this.logger.debug(`Deleted ${JSON.stringify(session)}`);

    return {
      message: result ? 'success' : 'error',
    };
  }

  public async updateSession(): Promise<any> {}
}
