import { Project } from '../../../modules/project/entities/project.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from '../entities/payment.entity';
import Mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../modules/user/entities/user.entity';

export const mapDtoPayment = (
  dto: CreatePaymentDto,
  project: Project &
    Mongoose.Document<any, any, any> & {
      _id: Mongoose.Types.ObjectId;
    },
  owner: User,
): Partial<Payment> => {
  return {
    uuid: uuidv4(),
    amount: dto.amount,
    memo: dto.memo,
    receiver: dto.receiver,
    receiver_fungible: dto.receiver_fungible,
    project: project,
    owner: owner,
  };
};
