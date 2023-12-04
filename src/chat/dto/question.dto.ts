import { Exclude } from 'class-transformer';

@Exclude()
export class QuestionDto {
  id: string;

  text: string;
}
