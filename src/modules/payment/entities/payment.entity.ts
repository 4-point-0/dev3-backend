import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
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
  @Prop({ required: false })
  receiver: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  receiver_fungible: string;

  @ApiProperty({
    type: String,
    enum: ['pending', 'paid'],
  })
  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
