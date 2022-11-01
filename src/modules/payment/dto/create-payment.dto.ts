import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import Mongoose from 'mongoose';
import { nearWalletRegex } from '../../../utils/regex';

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

  uid: string;
  owner: Mongoose.Types.ObjectId;
}
