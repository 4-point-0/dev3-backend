import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequest } from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { ServerError } from '../../helpers/response/errors';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name) private repo: Model<PaymentDocument>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<ServiceResult<Payment>> {
    try {
      if (!dto.uid) {
        return new BadRequest<Payment>(`Uid can't be empty`);
      }

      if (!dto.amount) {
        return new BadRequest<Payment>(`Amount can't be empty`);
      }

      if (!dto.owner) {
        return new BadRequest<Payment>(`Owner can't be empty`);
      }

      const result = await new this.repo(dto).save();
      return new ServiceResult<Payment>(result);
    } catch (error) {
      this.logger.error('ProjectService - create', error);
      return new ServerError<Payment>(`Can't create project`);
    }
  }
}
