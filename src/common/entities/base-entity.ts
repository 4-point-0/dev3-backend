import Mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';
import { User } from '../../modules/user/entities/user.entity';

export class BaseEntity {
  _id: Mongoose.Types.ObjectId;

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
    type: User,
  })
  @Prop({ type: Mongoose.Types.ObjectId, ref: User.name })
  owner: User;
}
