import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { nearWalletRegex } from '../../../utils/regex';
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
  @Matches(nearWalletRegex, {
    message: 'receiver must be named or implicit near wallet',
  })
  readonly receiver?: string;

  @ApiProperty({
    type: String,
  })
  readonly receiver_fungible?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  project_id: string;

  owner: Mongoose.Types.ObjectId;
}
