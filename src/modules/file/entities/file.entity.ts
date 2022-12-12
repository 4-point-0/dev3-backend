import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base-entity';

export type FileDocument = File & Document;

@Schema({
  _id: true,
})
export class File extends BaseEntity {
  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  mime_type: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  url?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({ required: true })
  key?: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
