import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTransactionRequestDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly txHash: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly receiptId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly caller_address: string;

  @IsOptional()
  @ApiProperty({ required: false })
  readonly txDetails?: any;
}
