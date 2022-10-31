import { getRpc } from '../../../helpers/rpc/rpc-helper';
import { AxiosPostDto } from '../dto/axios-post.dto';

export const getRpcPostArguments = (accountId: string): AxiosPostDto => {
  return {
    url: getRpc(),
    payload: {
      jsonrpc: '2.0',
      method: 'query',
      params: [`access_key/${accountId}`, ''],
      id: 1,
    },
    config: {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  };
};
