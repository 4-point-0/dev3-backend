import { TransactionRequestDto } from '../dto/transaction-request.dto';
import { TransactionRequest } from '../entities/transaction-request.entity';

export const mapTransactionRequestDto = (
  entity: TransactionRequest,
): TransactionRequestDto => {
  return {
    uuid: entity.uuid,
    created_at: entity.createdAt,
    status: entity.status,
    contractId: entity.contractId,
    method: entity.method,
    args: entity.args,
    gas: entity.gas,
    deposit: entity.deposit,
    project_id: entity.project._id.toString(),
  };
};
