import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../../helpers/response/errors';
import { generateKey } from '../../helpers/api-key/api-key-generator';
import { ApiKey, ApiKeyDocument } from './entities/api-key.entity';
import { ServiceResult } from '../../helpers/response/result';
import { Project, ProjectDocument } from '../project/entities/project.entity';
import { CreateApiKeyDto } from './dto/ create-api-key.dto';
import { ApiKeyDto } from './dto/api-key.dto';
import { mapToApiKeyDto, mapToPaginatedApiKeyDto } from './mappers/mappers';
import { RevokeApiKeyDto } from './dto/revoke-api-key.dto';
import { RegenerateApiKeyDto } from './dto/regenerate-api-key.dto';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { toPage } from '../../helpers/pagination/pagination-helper';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    @InjectModel(ApiKey.name) private apiKeyRepo: Model<ApiKeyDocument>,
    @InjectModel(Project.name) private projectRepo: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateApiKeyDto): Promise<ServiceResult<ApiKeyDto>> {
    try {
      if (!dto.project_id) {
        return new BadRequest<ApiKeyDto>(`project_id can't be empty`);
      }

      if (!Mongoose.Types.ObjectId.isValid(dto.project_id)) {
        return new NotFound<ApiKeyDto>('Project not found');
      }

      const project = await this.projectRepo
        .findOne({ _id: dto.project_id })
        .populate('owner')
        .exec();

      if (!project) {
        return new NotFound<ApiKeyDto>('Project not found');
      }

      if (project.owner._id.toString() !== dto.owner.toString()) {
        return new Unauthorized<ApiKeyDto>(
          'Unauthorized access to user project',
        );
      }

      const api_key = await generateKey();

      const key = await new this.apiKeyRepo({
        api_key: api_key,
        project: project,
        expires: dto.expires,
        owner: dto.owner,
      }).save();

      return new ServiceResult<ApiKeyDto>(mapToApiKeyDto(key));
    } catch (error) {
      this.logger.error('ApiKeyService - create', error);
      return error.errors
        ? new BadRequest<ApiKeyDto>(error.toString())
        : new ServerError<ApiKeyDto>(`Can't create api key`);
    }
  }

  async findAll(
    ownerId: Mongoose.Types.ObjectId,
    offset?: number,
    limit?: number,
    project_id?: string,
    api_key?: string,
  ): Promise<ServiceResult<PaginatedDto<ApiKeyDto>>> {
    try {
      const query = this.apiKeyRepo.find({ owner: ownerId }).populate('owner');
      const queryCount = this.apiKeyRepo
        .find({ owner: ownerId })
        .countDocuments();

      if (project_id) {
        query.find({ project: { $regex: project_id, $options: 'i' } });
      }
      if (api_key) {
        query.find({ api_key: { $regex: api_key, $options: 'i' } });
      }

      const paginatedDto = await toPage<ApiKey>(
        query,
        queryCount,
        offset,
        limit,
      );

      const apiKeyDtos: ApiKeyDto[] = [];

      for (const apiKey of paginatedDto.results) {
        const dto = mapToApiKeyDto(apiKey);
        apiKeyDtos.push(dto);
      }

      const paginatedApiKeyDto = mapToPaginatedApiKeyDto(
        paginatedDto,
        apiKeyDtos,
      );

      return new ServiceResult<PaginatedDto<ApiKeyDto>>(paginatedApiKeyDto);
    } catch (error) {
      this.logger.error('ApiKeyService - findAll', error);
      return new ServerError<PaginatedDto<ApiKeyDto>>(`Can't get api keys`);
    }
  }

  async getFirstActive(projectId: string): Promise<ServiceResult<ApiKeyDto>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(projectId)) {
        return new NotFound<ApiKeyDto>('Project not found');
      }

      const apiKey = await this.apiKeyRepo
        .findOne({
          project: new Mongoose.Types.ObjectId(projectId),
          expires: { $gt: new Date() },
          is_revoked: false,
        })
        .exec();

      if (!apiKey) {
        return new NotFound<ApiKeyDto>('Api key not found');
      }

      return new ServiceResult<ApiKeyDto>(mapToApiKeyDto(apiKey));
    } catch (error) {
      this.logger.error('ApiKeyService - getFirstActive', error);
      return new ServerError<ApiKeyDto>(`Can't get api key`);
    }
  }

  async isValid(apiKey: string): Promise<ServiceResult<boolean>> {
    try {
      const apiKeyDb = await this.apiKeyRepo
        .findOne({ api_key: apiKey })
        .exec();

      if (!apiKeyDb) {
        return new NotFound<boolean>('Api key not found!');
      }

      if (apiKeyDb.is_revoked) {
        return new BadRequest<boolean>('Api key revoked!');
      }

      if (apiKeyDb.expires < apiKeyDb.createdAt) {
        return new BadRequest<boolean>('Api key expired!');
      }

      return new ServiceResult<boolean>(true);
    } catch (error) {
      this.logger.error('ApiKeyService - isValid', error);
      return new ServerError<boolean>(`Can't validate api key`);
    }
  }

  async regenerate(
    apiKey: string,
    dto: RegenerateApiKeyDto,
    ownerId: string,
  ): Promise<ServiceResult<ApiKeyDto>> {
    try {
      const apiKeyDb = await this.apiKeyRepo
        .findOne({ api_key: apiKey })
        .populate('project')
        .exec();

      if (!apiKeyDb) {
        return new NotFound<ApiKeyDto>('Api key not found!');
      }

      if (apiKeyDb.project.owner._id.toString() !== ownerId) {
        return new Unauthorized<ApiKeyDto>(
          'Unauthorized access to user apiKey',
        );
      }

      if (apiKeyDb.is_revoked) {
        return new BadRequest<ApiKeyDto>('Api key revoked!');
      }

      apiKeyDb.api_key = await generateKey();
      apiKeyDb.expires = dto.expires;
      apiKeyDb.updatedAt = new Date();
      await this.apiKeyRepo.updateOne({ _id: apiKeyDb._id }, apiKeyDb);

      return new ServiceResult<ApiKeyDto>(mapToApiKeyDto(apiKeyDb));
    } catch (error) {
      this.logger.error('ApiKeyService - regenerate', error);
      return error.errors
        ? new BadRequest<ApiKeyDto>(error.toString())
        : new ServerError<ApiKeyDto>(`Can't regenerate api key`);
    }
  }

  async revoke(
    apiKey: string,
    dto: RevokeApiKeyDto,
    ownerId: string,
  ): Promise<ServiceResult<ApiKeyDto>> {
    try {
      const apiKeyDb = await this.apiKeyRepo
        .findOne({ api_key: apiKey })
        .populate('project')
        .exec();

      if (!apiKeyDb) {
        return new NotFound<ApiKeyDto>('Api key not found!');
      }

      if (apiKeyDb.expires < apiKeyDb.createdAt) {
        return new BadRequest<ApiKeyDto>('Api key expired!');
      }

      if (apiKeyDb.project.owner._id.toString() !== ownerId) {
        return new Unauthorized<ApiKeyDto>(
          'Unauthorized access to user apiKey',
        );
      }

      apiKeyDb.is_revoked = dto.is_revoked;
      apiKeyDb.updatedAt = new Date();
      await this.apiKeyRepo.updateOne({ _id: apiKeyDb._id }, apiKeyDb);

      return new ServiceResult<ApiKeyDto>(mapToApiKeyDto(apiKeyDb));
    } catch (error) {
      this.logger.error('ApiKeyService - isValid', error);
      return error.errors
        ? new BadRequest<ApiKeyDto>(error.toString())
        : new ServerError<ApiKeyDto>(`Can't revoke api key`);
    }
  }
}