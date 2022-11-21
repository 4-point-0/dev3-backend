import { Project } from '../../../modules/project/entities/project.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from '../entities/payment.entity';
import Mongoose from 'mongoose';

export const mapDtoPayment = (
  dto: CreatePaymentDto,
  project: Project &
    Mongoose.Document<any, any, any> & {
      _id: Mongoose.Types.ObjectId;
    },
): Partial<Payment> => {
  return {
    uid: dto.uid,
    amount: dto.amount,
    memo: dto.memo,
    receiver: dto.receiver,
    receiver_fungible: dto.receiver_fungible,
    project: project,
  };
};
