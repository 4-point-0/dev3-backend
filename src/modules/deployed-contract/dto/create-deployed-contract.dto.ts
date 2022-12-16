import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import Mongoose from 'mongoose';

export class CreateDeployedContractDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  alias: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  contract_template_id: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  args: any;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  project_id: string;

  owner: Mongoose.Types.ObjectId;
}
