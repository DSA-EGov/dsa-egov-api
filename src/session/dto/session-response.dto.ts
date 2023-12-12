import { Exclude, Expose, Type } from 'class-transformer';

import type { IResponse } from '@/types/IResponse';
import { Session } from '@/entities/session.entity';

@Exclude()
export class SessionResponseDto implements IResponse<Session> {
  @Expose()
  @Type(() => Session)
  readonly data: Session[];

  @Expose()
  readonly count: number;
}
