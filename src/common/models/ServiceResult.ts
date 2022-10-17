import { ServiceError } from './ServiceError';

export class ServiceResult<T> {
  constructor(readonly data?: T, readonly error?: ServiceError) {}
}
