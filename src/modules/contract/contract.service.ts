import { Injectable, Logger } from '@nestjs/common';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { ServiceResult } from '../../helpers/response/result';
import { ServerError } from '../../helpers/response/errors';
import { ContractDto } from './dto/contract.dto';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './entities/contract.entity';
import { Model } from 'mongoose';
import { mapDtoToContract } from './mappers/map-dto-to-contract';
import { toPage } from '../../helpers/pagination/pagination-helper';
dotenv.config();

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectModel(Contract.name) private repo: Model<ContractDocument>,
  ) {}

  async findAll(
    offset?: number,
    limit?: number,
    name?: string,
    isAudited?: boolean,
  ): Promise<ServiceResult<PaginatedDto<ContractDto>>> {
    try {
      const query = this.repo.find();
      const queryCount = this.repo.find().countDocuments();

      if (name) {
        query.find({ name: { $regex: name, $options: 'i' } });
      }

      if (isAudited) {
        query.find({ is_audited: isAudited });
      }

      const paginatedDto = await toPage<ContractDto>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<ContractDto>>(paginatedDto);
    } catch (error) {
      this.logger.error('ContractService - findAll', error);
      return new ServerError<PaginatedDto<ContractDto>>(`Can't get contracts`);
    }
  }

  async saveContracts(contracts: ContractDto[]): Promise<void> {
    try {
      for (let index = 0; index < contracts.length; index++) {
        const dto = contracts[index];
        const contractDb = await this.repo.findOne({ name: dto.name }).exec();

        if (contractDb) {
          const entity = mapDtoToContract(contractDb, dto);
          await this.repo.updateOne({ _id: contractDb._id }, entity);
        } else {
          await new this.repo(dto).save();
        }
      }
    } catch (error) {
      this.logger.error('ContractService - saveContracts', error);
    }
  }
}
