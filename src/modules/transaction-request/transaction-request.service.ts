import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { TransactionRequestStatus } from '../../common/enums/transaction-request.enum';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { Project, ProjectDocument } from '../project/entities/project.entity';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import {
  TransactionRequest,
  TransactionRequestDocument,
} from './entities/transaction-request.entity';
import { toPage } from '../../helpers/pagination/pagination-helper';
import { UpdateTransactionRequestDto } from './dto/update-transaction-request.dto';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { mapTransactionRequestDto } from './mappers/mapTransactionRequestDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionRequestService {
  private readonly logger = new Logger(TransactionRequestService.name);

  constructor(
    @InjectModel(TransactionRequest.name)
    private transactionRequestRepo: Model<TransactionRequestDocument>,
    @InjectModel(Project.name) private projectRepo: Model<ProjectDocument>,
  ) {}

  async create(
    dto: CreateTransactionRequestDto,
  ): Promise<ServiceResult<TransactionRequest>> {
    try {
      if (!dto.project_id) {
        return new BadRequest<TransactionRequest>(`project_id can't be empty`);
      }

      if (!dto.contractId) {
        return new BadRequest<TransactionRequest>(`ContractId can't be empty`);
      }

      if (!dto.method) {
        return new BadRequest<TransactionRequest>(`Method can't be empty`);
      }

      if (!Mongoose.Types.ObjectId.isValid(dto.project_id)) {
        return new NotFound<TransactionRequest>('Project not found');
      }

      const project = await this.projectRepo
        .findOne({ _id: new Mongoose.Types.ObjectId(dto.project_id) })
        .exec();

      if (!project) {
        return new NotFound<TransactionRequest>('Project not found');
      }

      if (project.owner._id.toString() !== dto.owner.toString()) {
        return new Unauthorized<TransactionRequest>(
          'Unauthorized access to user project',
        );
      }

      dto.project = new Mongoose.Types.ObjectId(dto.project_id);
      dto.uuid = uuidv4();
      const transactionRequest = await new this.transactionRequestRepo(
        dto,
      ).save();

      return new ServiceResult<TransactionRequest>(transactionRequest);
    } catch (error) {
      this.logger.error('TransactionRequestService - create', error);
      return new ServerError<TransactionRequest>(
        `Can't create transaction request`,
      );
    }
  }

  async findAll(
    ownerId: Mongoose.Types.ObjectId,
    offset?: number,
    limit?: number,
    project_id?: string,
    contractId?: string,
    method?: string,
    status?: TransactionRequestStatus,
  ): Promise<ServiceResult<PaginatedDto<TransactionRequest>>> {
    try {
      const query = this.transactionRequestRepo.find({
        owner: ownerId,
      });
      const queryCount = this.transactionRequestRepo
        .find({ owner: ownerId })
        .countDocuments();

      if (project_id) {
        query.find({ project: { $regex: project_id, $options: 'i' } });
      }

      if (contractId) {
        query.find({ contractId: { $regex: contractId, $options: 'i' } });
      }

      if (method) {
        query.find({
          method: { $regex: method, $options: 'i' },
        });
      }

      if (status) {
        query.find({ status: { $regex: status, $options: 'i' } });
      }

      const paginatedDto = await toPage<TransactionRequest>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<TransactionRequest>>(paginatedDto);
    } catch (error) {
      this.logger.error('TransactionRequestService - findAll', error);
      return new ServerError<PaginatedDto<TransactionRequest>>(
        `Can't get transaction requests`,
      );
    }
  }

  async findByUuid(
    uuid: string,
  ): Promise<ServiceResult<TransactionRequestDto>> {
    try {
      const transactionRequest = await this.transactionRequestRepo
        .findOne({ uuid })
        .exec();

      if (!transactionRequest) {
        return new NotFound<TransactionRequestDto>(
          'Transaction request not found',
        );
      }

      return new ServiceResult<TransactionRequestDto>(
        mapTransactionRequestDto(transactionRequest),
      );
    } catch (error) {
      this.logger.error('TransactionRequestService - findByUUid', error);
      return new ServerError<TransactionRequestDto>(
        `Can't get transaction request`,
      );
    }
  }

  async findOne(
    id: string,
    ownerId: string,
  ): Promise<ServiceResult<TransactionRequest>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<TransactionRequest>(
          'Transaction request not found',
        );
      }

      const transactionRequest = await this.transactionRequestRepo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!transactionRequest) {
        return new NotFound<TransactionRequest>(
          'Transaction request not found',
        );
      }

      if (transactionRequest.owner._id.toString() !== ownerId) {
        return new Unauthorized<TransactionRequest>(
          'Unauthorized access to user transaction request',
        );
      }

      return new ServiceResult<TransactionRequest>(transactionRequest);
    } catch (error) {
      this.logger.error('TransactionRequestService - findOne', error);
      return new ServerError<TransactionRequest>(
        `Can't get transaction request`,
      );
    }
  }

  async update(
    uuid: string,
    dto: UpdateTransactionRequestDto,
  ): Promise<ServiceResult<TransactionRequest>> {
    try {
      const updateTransactionRequest = await this.transactionRequestRepo
        .findOne({ uuid })
        .exec();

      if (!updateTransactionRequest) {
        return new NotFound<TransactionRequest>(
          'Transaction request not found',
        );
      }

      updateTransactionRequest.status = dto.status;
      updateTransactionRequest.updatedAt = new Date();
      await this.transactionRequestRepo.updateOne(
        { uuid },
        updateTransactionRequest,
      );
      return new ServiceResult<TransactionRequest>(updateTransactionRequest);
    } catch (error) {
      this.logger.error('TransactionRequestService - update', error);
      return new ServerError<TransactionRequest>(
        `Can't update transaction request`,
      );
    }
  }
}
