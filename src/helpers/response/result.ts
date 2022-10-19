import { ServiceError } from './error';

export class ServiceResult<T> {
  constructor(readonly data?: T, readonly error?: ServiceError) {}
}
