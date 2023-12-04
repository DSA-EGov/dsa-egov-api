import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostSessionDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name: string | undefined;
}
