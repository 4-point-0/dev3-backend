import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type AddressDocument = Address & Document;

@Schema({
  _id: true,
})
export class Address {
  _id: ObjectId;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  wallet: string;

  @Prop({ required: true })
  alias: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  owner: User;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
