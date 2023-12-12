import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QuestionDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly text: string;

  @Expose()
  readonly responseText: string;

  @Expose()
  readonly createdAt: Date;
}
