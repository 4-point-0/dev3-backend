import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type AddressDocument = Address & Document;

@Schema({
  _id: true,
})
export class Address {
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    type: Date,
  })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  wallet: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  alias: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  phone: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  email: string;

  @ApiProperty({
    type: User,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: User;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
