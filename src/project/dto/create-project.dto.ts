import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateProjectDto {
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  readonly isActive: boolean;

  @ApiProperty({
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    type: String,
  })
  readonly slug: string;

  @ApiProperty({
    type: String,
  })
  readonly logoUrl: string;

  owner: ObjectId;
}
