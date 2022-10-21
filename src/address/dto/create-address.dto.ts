import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import Mongoose from 'mongoose';
import { nearWalletRegex } from '../../utils/regex';
import { UpdateAddressDto } from './update-address.dto';

export class CreateAddressDto extends UpdateAddressDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @Matches(nearWalletRegex)
  wallet: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: false,
  })
  alias: string;

  owner: Mongoose.Types.ObjectId;
}
