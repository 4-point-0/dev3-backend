import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequest } from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { ServerError } from '../../helpers/response/errors';
import Mongoose from 'mongoose';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { toPage } from '../../helpers/pagination/pagination-helper';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { isNearWallet } from '../../utils/near-wallet-validation';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Payment.name) private repo: Model<PaymentDocument>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<ServiceResult<Payment>> {
    try {
      if (dto.receiver && !isNearWallet(dto.receiver)) {
        return new BadRequest<Payment>(`Receiver ${dto.receiver} not valid`);
      }

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
      this.logger.error('PaymentService - create', error);
      return new ServerError<Payment>(`Can't create payment`);
    }
  }

  async findAll(
    ownerId: Mongoose.Types.ObjectId,
    offset?: number,
    limit?: number,
    receiver?: string,
    receiver_fungible?: string,
    status?: PaymentStatus,
  ): Promise<ServiceResult<PaginatedDto<Payment>>> {
    try {
      const query = this.repo.find({ owner: ownerId });
      const queryCount = this.repo.find({ owner: ownerId }).countDocuments();

      if (receiver) {
        query.find({ receiver: { $regex: receiver, $options: 'i' } });
      }

      if (receiver_fungible) {
        query.find({
          receiver_fungible: { $regex: receiver_fungible, $options: 'i' },
        });
      }

      if (status) {
        query.find({ status: { $regex: status, $options: 'i' } });
      }

      const paginatedDto = await toPage<Payment>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<Payment>>(paginatedDto);
    } catch (error) {
      this.logger.error('PaymentService - findAll', error);
      return new ServerError<PaginatedDto<Payment>>(`Can't get payments`);
    }
  }
}
