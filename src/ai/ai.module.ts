import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AiService } from './ai.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
