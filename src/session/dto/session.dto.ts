import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SessionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;
}
