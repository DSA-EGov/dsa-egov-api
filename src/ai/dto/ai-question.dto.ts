import { IsString, IsUUID } from 'class-validator';

export class AiQuestionDto {
  @IsUUID()
  sessionId: string;

  @IsUUID()
  userId: string;

  @IsString()
  text: string;
}
