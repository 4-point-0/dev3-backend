import * as dotenv from 'dotenv';
dotenv.config();
import { rpcMainnet, rpcTestnet } from './rpc-constants';

const { NODE_ENV } = process.env;

export const getRpc = (): string => {
  if (NODE_ENV === 'dev' || NODE_ENV === 'staging') {
    return rpcTestnet;
  }

  return rpcMainnet;
};
