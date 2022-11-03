import { PagodaEventDataDto } from './pagoda-event-data.dto';

export class PagodaEventDto {
  block_hash: string;
  receipt_id: string;
  transaction_hash: string;
  event: string;
  standard: string;
  version: string;
  data: PagodaEventDataDto[];
}
