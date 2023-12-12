import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostQuestionDto {
  @ApiProperty({ type: String })
  @IsUUID()
  readonly sessionId: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly text: string;
}
