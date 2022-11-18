import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { ApiKey, ApiKeySchema } from './entities/api-key.entity';
import * as dotenv from 'dotenv';
import { Project, ProjectSchema } from '../project/entities/project.entity';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiKey.name, schema: ApiKeySchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
  ],

  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
