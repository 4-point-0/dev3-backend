import { rpcMainnet, rpcTestnet } from './rpc-constants';

export const getRpc = (NODE_ENV: string): string => {
  if (NODE_ENV === 'dev' || NODE_ENV === 'staging') {
    return rpcTestnet;
  }

  return rpcMainnet;
};
