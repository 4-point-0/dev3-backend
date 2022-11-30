import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { TransactionRequestStatus } from '../../../common/enums/transaction-request.enum';

export class UpdateTransactionRequestDto {
  @IsDefined()
  @ApiProperty({
    enum: [
      TransactionRequestStatus.Excecuted,
      TransactionRequestStatus.Pending,
    ],
    required: true,
  })
  readonly status: TransactionRequestStatus;
}
