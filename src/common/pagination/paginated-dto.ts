import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: Number,
  })
  limit: number;

  @ApiProperty({
    type: Number,
  })
  offset: number;

  results: TData[];
}
