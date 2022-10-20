import { HttpException, HttpStatus } from '@nestjs/common';

export class AdressNotUnique extends HttpException {
  constructor() {
    super("Wallet isn't unique!", HttpStatus.BAD_REQUEST);
  }
}
