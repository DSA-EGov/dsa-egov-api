import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from '@/entities/question.entity';
import { Session } from '@/entities/session.entity';
import { AiModule } from '@/ai/ai.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    HttpModule,
    AiModule,
    TypeOrmModule.forFeature([Question, Session]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
