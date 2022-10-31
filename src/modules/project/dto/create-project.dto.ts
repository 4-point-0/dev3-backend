import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import Mongoose from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly name?: string;

  @ApiProperty({
    type: String,
  })
  readonly slug?: string;

  @ApiProperty({
    type: String,
  })
  readonly logoUrl?: string;

  owner: Mongoose.Types.ObjectId;
}
