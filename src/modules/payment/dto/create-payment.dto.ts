import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import Mongoose from 'mongoose';

export class CreatePaymentDto {
  @ApiProperty({
    type: String,
  })
  readonly memo?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  readonly amount: string;

  @ApiProperty({
    type: String,
  })
  readonly receiver?: string;

  @ApiProperty({
    type: String,
  })
  readonly receiver_fungible?: string;

  uid: string;
  owner: Mongoose.Types.ObjectId;
}
