import { Exclude, Expose, Type } from 'class-transformer';

import type { IResponse } from '@/types/IResponse';
import { Question } from '@/entities/question.entity';

@Exclude()
export class QuestionResponseDto implements IResponse<Question> {
  @Expose()
  @Type(() => Question)
  readonly data: Question[];

  @Expose()
  readonly count: number;
}
