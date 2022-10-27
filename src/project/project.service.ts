import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model, ObjectId } from 'mongoose';
import { ServiceResult } from '../helpers/response/result';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../helpers/response/errors';
import { PaginatedDto } from '../common/pagination/paginated-dto';
import { toSlug } from '../utils/slug';
import { toPage } from '../helpers/pagination/pagination-helper';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name) private repo: Model<ProjectDocument>,
  ) {}

  async create(dto: CreateProjectDto): Promise<ServiceResult<Project>> {
    try {
      if (!dto.name) {
        return new BadRequest<Project>(`Name can't be empty`);
      }

      const projectNameDoc = await this.repo
        .exists({ owner: dto.owner, name: dto.name })
        .exec();

      if (projectNameDoc) {
        return new BadRequest<Project>(`Name ${dto.name} isn't unique`);
      }
      const result = await new this.repo(dto).save();
      return new ServiceResult<Project>(result);
    } catch (error) {
      this.logger.error('ProjectService - create', error);
      return new ServerError<Project>(`Can't create project`);
    }
  }

  async findAll(
    offset?: number,
    limit?: number,
    name?: string,
    slug?: string,
  ): Promise<ServiceResult<PaginatedDto<Project>>> {
    try {
      const query = this.repo.find();
      const totalQuery = this.repo.countDocuments();

      if (name) {
        query.find({ name: { $regex: name, $options: 'i' } });
      }

      if (slug) {
        query.find({ slug: { $regex: slug, $options: 'i' } });
      }

      const paginatedDto = await toPage<Project>(
        query,
        totalQuery,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<Project>>(paginatedDto);
    } catch (error) {
      this.logger.error('ProjectService - findAll', error);
      return new ServerError<PaginatedDto<Project>>(`Can't get projects`);
    }
  }

  findAllForOwner(ownerId: Mongoose.Types.ObjectId): Promise<Project[]> {
    return this.repo.find({ owner: ownerId }).populate('owner').exec();
  }

  findBySlugForOwner(slug: string, ownerId: ObjectId): Promise<Project> {
    return this.repo.findOne({ slug, owner: ownerId }).populate('owner').exec();
  }

  async findBySlug(slug: string): Promise<ServiceResult<Project>> {
    try {
      const project = await this.repo
        .findOne({ slug: slug })
        .populate('owner')
        .exec();

      if (!project) {
        return new NotFound<Project>('Project not found');
      }
      return new ServiceResult<Project>(project);
    } catch (error) {
      this.logger.error('ProjectService - findBySlug', error);
      return new ServerError<Project>(`Can't get project`);
    }
  }

  async findOne(id: string): Promise<ServiceResult<Project>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Project>('Project not found');
      }
      const project = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!project) {
        return new NotFound<Project>('Project not found');
      }
      return new ServiceResult<Project>(project);
    } catch (error) {
      this.logger.error('ProjectService - findOne', error);
      return new ServerError<Project>(`Can't get project`);
    }
  }

  async update(
    id: string,
    userUid: string,
    dto: UpdateProjectDto,
  ): Promise<ServiceResult<Project>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Project>('Project not found');
      }

      const project = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!project) {
        return new NotFound<Project>('Project not found');
      }

      if (project.owner.uid !== userUid) {
        return new Unauthorized<Project>('Unauthorized access to user project');
      }

      const updateProject = await this.repo.findOne({ _id: id }).exec();
      updateProject.name = dto.name ?? dto.name;
      updateProject.logoUrl = dto.logoUrl ?? dto.logoUrl;
      updateProject.slug = toSlug(dto.slug ? dto.slug : dto.name);
      await this.repo.updateOne({ _id: id }, updateProject);
      return new ServiceResult<Project>(updateProject);
    } catch (error) {
      this.logger.error('ProjectService - update', error);
      return new ServerError<Project>(`Can't update project`);
    }
  }
}
