import { ApiProperty } from '@nestjs/swagger';

export class ProjectTransactionRequestDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  logo_url: string;
}
