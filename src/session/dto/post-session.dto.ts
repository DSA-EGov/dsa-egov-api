import { ApiPropertyOptional } from '@nestjs/swagger';

export class PostSessionDto {
  @ApiPropertyOptional({ type: String })
  name: string | undefined;
}
