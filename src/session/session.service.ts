import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Session } from '@/entities/session.entity';
import { ResponseDto } from '@/dto/response.dto';
import { ActionResponseDto } from '@/dto/action-response.dto';

import { PostSessionDto, SessionDto, UpdateSessionDto } from './dto';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  public async getSessions(userId: string): Promise<ResponseDto<SessionDto>> {
    let sessions = await this.sessionsRepo.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
      skip: 0, // TODO: add filtering
      take: 999,
    });

    sessions ??= [];

    return {
      count: sessions.length,
      data: plainToInstance(SessionDto, sessions),
    };
  }

  public async postSession(
    userId: string,
    body: PostSessionDto,
  ): Promise<SessionDto> {
    const session = this.sessionsRepo.create();
    session.name = body.name || null;
    session.userId = userId;

    await this.sessionsRepo.save(session);
    this.logger.debug(`Created ${JSON.stringify(session)}`);

    return plainToInstance(SessionDto, session);
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

  public async updateSession(
    userId: string,
    sessionId: string,
    dto: UpdateSessionDto,
  ): Promise<SessionDto> {
    const session = await this.sessionsRepo.findOneBy({ id: sessionId });

    if (!session) {
      throw new NotFoundException();
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException();
    }

    session.name = dto.name ?? session.name;

    await this.sessionsRepo.save(session);
    this.logger.debug(`Updated ${JSON.stringify(session)}`);

    return plainToInstance(SessionDto, session);
  }
}
