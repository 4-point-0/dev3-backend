import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import Mongoose from 'mongoose';

export class CreateTransactionRequestDto {
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  readonly contractId?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly method: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly args?: any;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  readonly gas?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly deposit?: string;

  @IsOptional()
  @ApiProperty({ required: true })
  readonly is_near_token: boolean;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  project_id: string;

  uuid: string;
  owner: Mongoose.Types.ObjectId;
  project: Mongoose.Types.ObjectId;
}
