import { PaymentDto } from '../dto/payment.dto';
import { Payment } from '../entities/payment.entity';

export const mapPaymentGet = (
  payment: Payment,
  isIdIncluded: boolean,
): PaymentDto => {
  return {
    _id: isIdIncluded ? payment._id.toString() : undefined,
    uuid: payment.uuid,
    amount: payment.amount,
    memo: payment.memo,
    receiver: payment.receiver,
    receiver_fungible: payment.receiver_fungible,
    status: payment.status,
    project_id: payment.project._id.toString(),
  };
};