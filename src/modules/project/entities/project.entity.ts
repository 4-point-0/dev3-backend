import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import Mongoose, { Document } from 'mongoose';
import { User } from '../../../modules/user/entities/user.entity';
import { BaseEntity } from '../../../common/entities/base-entity';
import { toSlug } from '../../../utils/slug';

export type ProjectDocument = Project & Document;

@Schema({
  _id: true,
})
export class Project extends BaseEntity {
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
  @Prop({ required: false, default: null })
  logoUrl?: string;

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
