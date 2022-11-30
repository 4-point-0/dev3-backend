import { Project } from '../../../modules/project/entities/project.entity';
import { CreateTransactionRequestDto } from '../dto/create-transaction-request.dto';
import Mongoose from 'mongoose';
import { TransactionRequest } from '../entities/transaction-request.entity';
import { User } from '../../../modules/user/entities/user.entity';

export const mapCreateDtoToTransactionRequest = (
  dto: CreateTransactionRequestDto,
  project: Project &
    Mongoose.Document<any, any, any> & {
      _id: Mongoose.Types.ObjectId;
    },
  owner: User &
    Mongoose.Document<any, any, any> & {
      _id: Mongoose.Types.ObjectId;
    },
): Partial<TransactionRequest> => {
  return {
    contractId: dto.contractId,
    method: dto.method,
    args: dto.args,
    gas: dto.gas,
    deposit: dto.deposit,
    owner: owner,
    project: project,
  };
};
