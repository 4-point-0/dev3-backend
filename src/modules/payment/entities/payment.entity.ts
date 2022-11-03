import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { nearWalletRegex } from '../../../utils/regex';
import { BaseEntity } from '../../../common/entities/base-entity';

export type PaymentDocument = Payment & Document;

@Schema({
  _id: true,
})
export class Payment extends BaseEntity {
  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  uid: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  memo: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  amount: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false, match: nearWalletRegex })
  receiver: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  receiver_fungible: string;

  @ApiProperty({
    enum: [PaymentStatus.Pending, PaymentStatus.Paid],
  })
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
