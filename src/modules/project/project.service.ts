import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { toPage } from '../../helpers/pagination/pagination-helper';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { toSlug } from '../../utils/slug';
import { FileDocument, File } from '../file/entities/file.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import { mapToProjectDto } from './mappers/maptToProjectDto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name) private projectRepo: Model<ProjectDocument>,
    @InjectModel(File.name) private fileRepo: Model<FileDocument>,
  ) {}

  async create(dto: CreateProjectDto): Promise<ServiceResult<Project>> {
    try {
      if (!dto.name) {
        return new BadRequest<Project>(`Name can't be empty`);
      }

      const projectNameDoc = await this.projectRepo
        .exists({ owner: dto.owner, name: dto.name })
        .exec();

      if (projectNameDoc) {
        return new BadRequest<Project>(`Name ${dto.name} isn't unique`);
      }

      const file = await this.fileRepo
        .findOne({
          _id: new Mongoose.Types.ObjectId(dto.logo_id),
        })
        .populate('owner')
        .exec();

      if (!file) {
        return new NotFound<Project>('Logo not found');
      }

      if (file.owner._id.toString() !== dto.owner.toString()) {
        return new Unauthorized<Project>('Unauthorized access to user file');
      }

      const result = await new this.projectRepo({
        name: dto.name,
        slug: dto.slug,
        logo: file !== null ? file._id : null,
        owner: dto.owner,
      }).save();
      return new ServiceResult<Project>(result);
    } catch (error) {
      console.log(error);
      this.logger.error('ProjectService - create', error);
      return new ServerError<Project>(`Can't create project`);
    }
  }

  async findAll(
    ownerId: Mongoose.Types.ObjectId,
    offset?: number,
    limit?: number,
    name?: string,
    slug?: string,
  ): Promise<ServiceResult<PaginatedDto<Project>>> {
    try {
      const query = this.projectRepo
        .find({ owner: ownerId })
        .populate('owner')
        .populate('logo');
      const queryCount = this.projectRepo
        .find({ owner: ownerId })
        .countDocuments();

      if (name) {
        query.find({ name: { $regex: name, $options: 'i' } });
      }

      if (slug) {
        query.find({ slug: { $regex: slug, $options: 'i' } });
      }

      const paginatedDto = await toPage<Project>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<Project>>(paginatedDto);
    } catch (error) {
      this.logger.error('ProjectService - findAll', error);
      return new ServerError<PaginatedDto<Project>>(`Can't get projects`);
    }
  }

  async findBySlug(slug: string): Promise<ServiceResult<ProjectDto>> {
    try {
      const project = await this.projectRepo
        .findOne({ slug: slug })
        .populate('logo')
        .exec();

      if (!project) {
        return new NotFound<ProjectDto>('Project not found');
      }

      return new ServiceResult<ProjectDto>(mapToProjectDto(project));
    } catch (error) {
      this.logger.error('ProjectService - findBySlug', error);
      return new ServerError<ProjectDto>(`Can't get project`);
    }
  }

  async findOne(id: string, ownerId: string): Promise<ServiceResult<Project>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Project>('Project not found');
      }

      const project = await this.projectRepo
        .findOne({ _id: id })
        .populate('owner')
        .populate('logo')
        .exec();

      if (!project) {
        return new NotFound<Project>('Project not found');
      }

      if (project.owner._id.toString() !== ownerId) {
        return new Unauthorized<Project>('Unauthorized access to user project');
      }

      return new ServiceResult<Project>(project);
    } catch (error) {
      this.logger.error('ProjectService - findOne', error);
      return new ServerError<Project>(`Can't get project`);
    }
  }

  async update(
    id: string,
    ownerId: string,
    dto: UpdateProjectDto,
  ): Promise<ServiceResult<Project>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Project>('Project not found');
      }

      const project = await this.projectRepo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!project) {
        return new NotFound<Project>('Project not found');
      }

      if (project.owner._id.toString() !== ownerId) {
        return new Unauthorized<Project>('Unauthorized access to user project');
      }

      if (dto.logo_id) {
        const file = await this.fileRepo
          .findOne({
            _id: new Mongoose.Types.ObjectId(dto.logo_id),
          })
          .populate('owner')
          .exec();

        if (!file) {
          return new NotFound<Project>('Logo not found');
        }

        if (file.owner._id.toString() !== ownerId) {
          return new Unauthorized<Project>(
            'Unauthorized access to user project',
          );
        }

        project.logo = file.id;
      }

      if (dto.logo_id === null) {
        project.logo = null;
      }

      project.name = dto.name ?? project.name;
      project.slug = toSlug(dto.slug ? dto.slug : project.name);
      project.updatedAt = new Date();
      await this.projectRepo.updateOne({ _id: id }, project);

      const updatedProject = await this.projectRepo
        .findOne({ _id: id })
        .populate('owner')
        .populate('logo')
        .exec();

      return new ServiceResult<Project>(updatedProject);
    } catch (error) {
      this.logger.error('ProjectService - update', error);
      return new ServerError<Project>(`Can't update project`);
    }
  }
}
