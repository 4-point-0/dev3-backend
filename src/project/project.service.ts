import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model, ObjectId } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private repo: Model<ProjectDocument>,
  ) {}

  create(createProjectDto: CreateProjectDto): Promise<Project> {
    const created = new this.repo(createProjectDto);
    return created.save();
  }

  findAll(isAdmin = false): Promise<Project[]> {
    return this.repo
      .find(isAdmin ? {} : { isActive: true, isCensored: false })
      .populate('owner')
      .exec();
  }

  findAllForOwner(ownerId: Mongoose.Types.ObjectId): Promise<Project[]> {
    return this.repo.find({ owner: ownerId }).populate('owner').exec();
  }

  findBySlugForOwner(slug: string, ownerId: ObjectId): Promise<Project> {
    return this.repo.findOne({ slug, owner: ownerId }).populate('owner').exec();
  }

  findBySlug(slug: string): Promise<Project> {
    return this.repo
      .findOne({ slug, isActive: true, isCensored: false })
      .populate('owner')
      .exec();
  }

  findOne(id: string): Promise<Project> {
    return this.repo.findOne({ _id: id }).populate('owner').exec();
  }

  update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.repo.findByIdAndUpdate(id, updateProjectDto).exec();
  }

  remove(id: string): Promise<Project> {
    return this.repo.findByIdAndDelete(id).exec();
  }
}
