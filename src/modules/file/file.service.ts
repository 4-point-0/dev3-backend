import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { ServiceResult } from '../../helpers/response/result';
import { v4 as uuid } from 'uuid';
import { FileDocument, File } from './entities/file.entity';
import { NotFound, ServerError } from '../../helpers/response/errors';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectModel(File.name) private repo: Model<FileDocument>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<ServiceResult<File>> {
    try {
      const s3 = this.getS3();
      const params = {
        Bucket: this.configService.get('aws.bucket_name'),
        Key: `${uuid()}-${fileName}`,
        Body: dataBuffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.configService.get('aws.region'),
        },
      };

      const uploadResult = await s3.upload(params).promise();

      const file = await new this.repo({
        name: fileName,
        url: uploadResult.Location,
        key: uploadResult.Key,
        mime_type: mimetype,
      }).save();

      return new ServiceResult<File>(file);
    } catch (error) {
      this.logger.error('FileService - upload', error);
      return new ServerError<File>(`Can't upload file`);
    }
  }

  async putFile(url: string, dataBuffer: Buffer): Promise<ServiceResult<File>> {
    try {
      const file = await this.repo.findOne({ url: url }).exec();

      if (!file) {
        return new NotFound<File>('File not found');
      }

      const s3 = this.getS3();
      const params = {
        Bucket: this.configService.get('aws.bucket_name'),
        Key: file.key,
        Body: dataBuffer,
        ACL: 'public-read',
        ContentType: file.mime_type,
        ContentDisposition: 'inline',
      };

      await s3.putObject(params).promise();

      file.updatedAt = new Date();
      await this.repo.updateOne({ _id: file.id }, file);

      return new ServiceResult<File>(file);
    } catch (error) {
      this.logger.error('FileService - update file', error);
      return new ServerError<File>(`Can't update file`);
    }
  }

  getS3() {
    return new S3({
      accessKeyId: this.configService.get('aws.access_key'),
      secretAccessKey: this.configService.get('aws.secret_key'),
    });
  }
}
