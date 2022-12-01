import { TransactionRequestStatus } from '../../../common/enums/transaction-request.enum';

export class TransactionRequestDto {
  uuid: string;
  created_at: Date;
  status: TransactionRequestStatus;
  contractId: string;
  method: string;
  args?: any;
  gas?: string;
  deposit?: string;
  caller_address?: string;
  txHash: string;
  receiptId: string;
  txDetails: string;
  project_id: string;
}
