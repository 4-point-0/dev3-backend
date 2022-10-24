import { HttpException } from '@nestjs/common';
import { ServiceResult } from './result';

export const handle = async <T>(result: ServiceResult<T>) => {
  if (result.data) {
    return result.data;
  }

  throw new HttpException(result.error.message, result.error.code);
};
