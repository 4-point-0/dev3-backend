import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import Mongoose from 'mongoose';
import { nearWalletRegex } from '../../utils/regex';

export class CreateAddressDto {
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

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  email: string;
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  phone: string;

  owner: Mongoose.Types.ObjectId;
}
