import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { toPage } from '../../helpers/pagination/pagination-helper';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { isNearWallet } from '../../utils/near-wallet-validation';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PagodaEventDataDto } from './dto/pagoda-event-data.dto';
import { PaymentDto } from './dto/payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { mapPaymentGet } from './mappers/map-payment-get.ts';

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
    uid?: string,
    receiver?: string,
    receiver_fungible?: string,
    status?: PaymentStatus,
  ): Promise<ServiceResult<PaginatedDto<Payment>>> {
    try {
      const query = this.repo.find({ owner: ownerId }).populate('owner');
      const queryCount = this.repo.find({ owner: ownerId }).countDocuments();

      if (uid) {
        query.find({ uid: { $regex: uid, $options: 'i' } });
      }

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

  async findByUid(uid: string): Promise<ServiceResult<PaymentDto>> {
    try {
      const payment = await this.repo.findOne({ uid }).exec();

      if (!payment) {
        return new NotFound<PaymentDto>('Payment not found');
      }

      return new ServiceResult<PaymentDto>(payment);
    } catch (error) {
      this.logger.error('PaymentService - findByUid', error);
      return new ServerError<PaymentDto>(`Can't get Payment`);
    }
  }

  async findOne(id: string): Promise<ServiceResult<PaymentDto>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<PaymentDto>('Payment not found');
      }

      const payment = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!payment) {
        return new NotFound<PaymentDto>('Payment not found');
      }

      return new ServiceResult<PaymentDto>(mapPaymentGet(payment));
    } catch (error) {
      this.logger.error('PaymentService - findOne', error);
      return new ServerError<PaymentDto>(`Can't get payment`);
    }
  }

  async updatePagoda(dto: any): Promise<ServiceResult<PaymentDto>> {
    try {
      const invalidJson = dto.payload.Events.data;
      const validJson = invalidJson.replaceAll(`'`, `"`);
      const parsed: PagodaEventDataDto[] = JSON.parse(validJson);

      if (parsed.length === 0) {
        return new BadRequest<PaymentDto>('Payment event data not valid');
      }

      if (!parsed[0].memo) {
        return new BadRequest<PaymentDto>('Payment memo not valid');
      }

      const id = parsed[0].memo;

      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<PaymentDto>('Payment not found');
      }

      const payment = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!payment) {
        return new NotFound<PaymentDto>('Payment not found');
      }

      const updatePayment = await this.repo.findOne({ _id: id }).exec();
      updatePayment.status = PaymentStatus.Paid;
      updatePayment.updatedAt = new Date();
      await this.repo.updateOne({ _id: id }, updatePayment);
      return new ServiceResult<PaymentDto>(mapPaymentGet(updatePayment));
    } catch (error) {
      this.logger.error('PaymentService - update', error);
      return new ServerError<PaymentDto>(`Can't update payment`);
    }
  }
}
