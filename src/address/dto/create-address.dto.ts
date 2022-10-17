import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  wallet: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  alias: string;
  @ApiProperty({
    type: String,
    required: false,
  })
  email: string;
  @ApiProperty({
    type: String,
    required: false,
  })
  phone: string;

  owner: ObjectId;
}
