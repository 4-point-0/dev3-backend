import { PagodaPayloadDto } from './pagoda-payload.dto';

export class PagodaDto {
  chain_id: string;
  alert_rule_id: number;
  alert_name: string;
  payload: PagodaPayloadDto;
}
