import { ApiProperty } from '@nestjs/swagger';
import { DeployedContractStatus } from 'src/common/enums/deployed-contract-status.enum';

export class DeployedContractDto {
  @ApiProperty({
    type: String,
  })
  uuid: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  alias: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  tags: string[];

  @ApiProperty({
    enum: [DeployedContractStatus.Pending, DeployedContractStatus.Deployed],
  })
  status: DeployedContractStatus;

  @ApiProperty()
  args: any;

  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    type: Date,
  })
  updated_at: Date;
}
