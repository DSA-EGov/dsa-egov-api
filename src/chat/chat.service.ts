import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { Session } from '@/entities/session.entity';
import { Question } from '@/entities/question.entity';
import { AiService } from '@/ai/ai.service';
import { PostQuestionDto } from '@/chat/dto/post-question.dto';

import { QuestionResponseDto } from './dto/question-response.dto';
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
    private readonly aiService: AiService,
  ) {}

  public async getQuestions(
    sessionId: string,
    userId: string,
  ): Promise<QuestionResponseDto> {
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
      data: session.questions.reverse(),
    };
  }

  public async postQuestion(
    dto: PostQuestionDto,
    userId: string,
  ): Promise<QuestionDto> {
    const question = this.questionsRepo.create();

    const session = await this.sessionsRepo.findOne({
      where: { id: dto.sessionId },
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

    question.text = dto.text;
    question.session = session;
    session.questions.push(question);

    await this.questionsRepo.save(question);
    await this.sessionsRepo.save(session);

    const answer = await this.aiService.queryAnswer({
      text: dto.text,
      sessionId: dto.sessionId,
      userId,
    });

    question.responseText = answer;

    await this.questionsRepo.save(question);

    this.logger.debug(dto.text + ': ' + answer);

    return plainToInstance(QuestionDto, question);
  }
}
