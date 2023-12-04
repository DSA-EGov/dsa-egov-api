import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from '@/chat/chat.module';

import { AiService } from './ai.service';

@Module({
  imports: [HttpModule, ChatModule],
  controllers: [],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
