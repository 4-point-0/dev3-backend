import { TransactionRequestStatus } from '../../../common/enums/transaction-request.enum';

export class TransactionRequestDto {
  uuid: string;
  created_at: Date;
  status: TransactionRequestStatus;
  contractId: string;
  method: string;
  args: any;
  gas: string;
  deposit: string;
  project_id: string;
}
