import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import {
  Contract,
  ContractDocument,
} from '../contract/entities/contract.entity';
import { Project, ProjectDocument } from '../project/entities/project.entity';
import { CreateDeployedContractDto } from './dto/create-deployed-contract.dto';
import {
  DeployedContract,
  DeployedContractDocument,
} from './entities/deployed-contract.entity';
import { v4 as uuidv4 } from 'uuid';
import { DeployedContractStatus } from '../../common/enums/deployed-contract-status.enum';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { toPage } from '../../helpers/pagination/pagination-helper';

@Injectable()
export class DeployedContractService {
  private readonly logger = new Logger(DeployedContractService.name);

  constructor(
    @InjectModel(DeployedContract.name)
    private deployedContractRepo: Model<DeployedContractDocument>,
    @InjectModel(Project.name) private projectRepo: Model<ProjectDocument>,
    @InjectModel(Contract.name)
    private contractTemplateRepo: Model<ContractDocument>,
    private configService: ConfigService,
  ) {}

  async create(
    dto: CreateDeployedContractDto,
  ): Promise<ServiceResult<DeployedContract>> {
    try {
      if (!dto.alias) {
        return new BadRequest<DeployedContract>(`Alias can't be empty`);
      }

      if (!dto.contract_template_id) {
        return new BadRequest<DeployedContract>(`Contract uuid can't be empty`);
      }

      if (!Mongoose.Types.ObjectId.isValid(dto.contract_template_id)) {
        return new NotFound<DeployedContract>('Contract template not found');
      }

      if (!dto.args) {
        return new BadRequest<DeployedContract>(`Args can't be empty`);
      }

      if (!dto.project_id) {
        return new BadRequest<DeployedContract>(`Project uuid can't be empty`);
      }

      if (!Mongoose.Types.ObjectId.isValid(dto.project_id)) {
        return new NotFound<DeployedContract>('Project not found');
      }

      const project = await this.projectRepo
        .findOne({ id: new Mongoose.Types.ObjectId(dto.project_id) })
        .exec();

      if (!project) {
        return new NotFound<DeployedContract>('Project not found');
      }

      const contract_template = await this.contractTemplateRepo
        .findOne({
          id: new Mongoose.Types.ObjectId(dto.contract_template_id),
        })
        .exec();

      if (!contract_template) {
        return new NotFound<DeployedContract>('Contract template not found');
      }

      const aliasExists = await this.deployedContractRepo
        .exists({ owner: dto.owner, alias: dto.alias })
        .exec();

      if (aliasExists) {
        return new BadRequest<DeployedContract>(
          `Alias ${dto.alias} isn't unique`,
        );
      }

      const entity = {
        uuid: uuidv4(),
        alias: dto.alias,
        args: dto.args,
        project: project._id,
        contract_template: contract_template._id,
        tags: contract_template.tags,
        owner: dto.owner,
      };

      const deployedContract = await new this.deployedContractRepo(
        entity,
      ).save();

      return new ServiceResult<DeployedContract>(deployedContract);
    } catch (error) {
      this.logger.error('DeployedContractService - create', error);
      return new ServerError<DeployedContract>(
        `Can't create deployed contract`,
      );
    }
  }

  async findAll(
    ownerId: Mongoose.Types.ObjectId,
    offset?: number,
    limit?: number,
    project_id?: string,
    alias?: string,
    contract_template_id?: string,
    status?: DeployedContractStatus,
    tags?: string[],
  ): Promise<ServiceResult<PaginatedDto<DeployedContract>>> {
    try {
      const query = this.deployedContractRepo.find({
        owner: ownerId,
      });
      const queryCount = this.deployedContractRepo
        .find({ owner: ownerId })
        .countDocuments();

      if (project_id && Mongoose.Types.ObjectId.isValid(project_id)) {
        query.find({
          project: new Mongoose.Types.ObjectId(project_id),
        });
      }

      if (alias) {
        query.find({
          alias: { $regex: alias, $options: 'i' },
        });
      }

      if (
        contract_template_id &&
        Mongoose.Types.ObjectId.isValid(contract_template_id)
      ) {
        query.find({
          contract_template: { $regex: contract_template_id, $options: 'i' },
        });
      }

      if (status) {
        query.find({ status: { $regex: status, $options: 'i' } });
      }

      if (tags) {
        query.find({ tags: { $regex: tags, $options: 'i' } });
      }

      const paginatedDto = await toPage<DeployedContract>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<DeployedContract>>(paginatedDto);
    } catch (error) {
      this.logger.error('DeployedContractService - findAll', error);
      return new ServerError<PaginatedDto<DeployedContract>>(
        `Can't get deployed contracts`,
      );
    }
  }
}
