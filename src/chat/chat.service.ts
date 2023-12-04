import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Session } from '@/entities/session.entity';
import { Question } from '@/entities/question.entity';
import { ResponseDto } from '@/dto/response.dto';

import { QuestionDto } from './dto/question.dto';
import { ChatController } from './chat.controller';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatController.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
  ) {}

  public async getQuestions(
    sessionId: string,
    userId: string,
  ): Promise<ResponseDto<QuestionDto>> {
    const session = await this.sessionsRepo.findOne({
      where: {
        id: sessionId,
      },
      relations: {
        questions: true,
      },
    });

    if (!session) {
      throw new NotFoundException();
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException();
    }

    return {
      count: session.questions.length,
      data: session.questions,
    };
  }

  public async postQuestion(
    userId: string,
    sessionId: string,
    text: string,
  ): Promise<void> {
    const question = this.questionsRepo.create();
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
      relations: {
        questions: true,
      },
    });

    if (!session) {
      throw new NotFoundException();
    }

    if (session.userId !== userId) {
      throw new UnauthorizedException();
    }

    question.text = text;
    question.session = session;
    session.questions.push(question);

    await this.questionsRepo.save(question);
    await this.sessionsRepo.save(session);
  }

  public async postAnswer(): Promise<void> {}
}
