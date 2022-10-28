import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import Mongoose, { Document } from 'mongoose';
import { toSlug } from '../../utils/slug';
import { User } from '../../user/entities/user.entity';

export type ProjectDocument = Project & Document;

@Schema({
  _id: true,
})
export class Project {
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
    type: Boolean,
  })
  @ApiProperty({
    type: String,
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ unique: true })
  slug: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: false })
  logoUrl: string;

  @ApiProperty({
    type: User,
  })
  @Prop({ type: Mongoose.Types.ObjectId, ref: User.name })
  owner: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.pre('save', function (next) {
  this.slug = toSlug(this.slug ? this.slug : this.name);
  next();
});
