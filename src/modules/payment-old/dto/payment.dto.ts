import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class PaymentDto {
  @ApiProperty({
    type: String,
  })
  readonly _id?: string;

  @ApiProperty({
    type: String,
  })
  readonly project_id: string;

  @ApiProperty({
    type: String,
  })
  readonly uuid: string;

  @ApiProperty({
    type: String,
  })
  readonly amount: string;

  @ApiProperty({
    type: String,
  })
  readonly memo?: string;

  @ApiProperty({
    type: String,
  })
  readonly receiver?: string;

  @ApiProperty({
    type: String,
  })
  readonly receiver_fungible?: string;

  @ApiProperty({
    enum: [PaymentStatus.Pending, PaymentStatus.Paid],
  })
  readonly status?: string;
}
