import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import Mongoose, { Document } from 'mongoose';
import { Project } from '../../../modules/project/entities/project.entity';
import { BaseEntity } from '../../../common/entities/base-entity';
import { User } from '../../../modules/user/entities/user.entity';
import { TransactionRequestStatus } from '../../../common/enums/transaction-request.enum';

export type TransactionRequestDocument = TransactionRequest & Document;

@Schema({
  _id: true,
})
export class TransactionRequest extends BaseEntity {
  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  uuid: string;

  @ApiProperty({
    type: String,
    enum: [
      TransactionRequestStatus.Pending,
      TransactionRequestStatus.Excecuted,
    ],
  })
  @Prop({
    type: String,
    required: true,
    enum: TransactionRequestStatus,
    default: TransactionRequestStatus.Pending,
  })
  status: TransactionRequestStatus;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  contractId: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  method: string;

  @ApiProperty()
  @Prop({
    required: false,
    get: (args: string) => {
      try {
        return JSON.parse(args);
      } catch (err) {
        return args;
      }
    },
    set: (args: any) => {
      return JSON.stringify(args);
    },
  })
  args?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  gas?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  deposit?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  txHash?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  receiptId?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  caller_address?: string;

  @ApiProperty()
  @Prop({
    required: false,
    get: (txDetails: string) => {
      try {
        return JSON.parse(txDetails);
      } catch (err) {
        return txDetails;
      }
    },
    set: (txDetails: any) => {
      return JSON.stringify(txDetails);
    },
  })
  txDetails?: string;

  @ApiProperty({
    type: User,
  })
  @Prop({ type: Mongoose.Types.ObjectId, ref: User.name })
  owner: User;

  @ApiProperty({
    type: Project,
  })
  @Prop({ type: Mongoose.Types.ObjectId, ref: Project.name })
  project: Project;
}

export const TransactionRequestSchema =
  SchemaFactory.createForClass(TransactionRequest);
