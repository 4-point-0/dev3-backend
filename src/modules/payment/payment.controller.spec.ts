import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAuthUser,
  mockPayments,
  mockPaymentDto,
  mockCreatePaymentDtos,
} from '../../../test/mock-tests-data';
import { ServiceResult } from '../../helpers/response/result';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { PaymentDto } from './dto/payment.dto';
import { Project } from '../project/entities/project.entity';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentController,
        PaymentService,
        { provide: getModelToken(Payment.name), useValue: jest.fn() },
        { provide: getModelToken(Project.name), useValue: jest.fn() },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    paymentController = module.get<PaymentController>(PaymentController);
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const result = new ServiceResult<PaginatedDto<Payment>>({
        total: 4,
        limit: 0,
        offset: 0,
        results: mockPayments,
      });
      jest.spyOn(paymentService, 'findAll').mockResolvedValue(result);
      const req: any = {
        user: mockAuthUser,
      };
      const response = await paymentController.findAll(req);
      expect(response).toBe(result.data);
    });
  });

  describe('findById', () => {
    it('should return one payment by id', async () => {
      const result = new ServiceResult<PaymentDto>(mockPaymentDto);
      jest.spyOn(paymentService, 'findOne').mockResolvedValue(result);
      const response = await paymentController.findById(mockPaymentDto._id);

      expect(response).toBe(result.data);
    });

    it('should return Payment not found (Not Found - 404) exception', async () => {
      const result = new NotFound<PaymentDto>('Payment not found');
      jest.spyOn(paymentService, 'findOne').mockResolvedValue(result);
      try {
        await paymentController.findById('624ff1e4bb85ed5475a1ff5d');
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Payment not found');
      }
    });
  });

  describe('create', () => {
    it('should create one payment', async () => {
      const result = new ServiceResult<Payment>(mockPayments[0]);
      jest.spyOn(paymentService, 'create').mockResolvedValue(result);
      const response = await paymentController.create(mockCreatePaymentDtos[0]);
      expect(response).toBe(result.data);
    });

    it(`should return Uid can't be empty (Bad request - 400) exception`, async () => {
      const dto = { ...mockCreatePaymentDtos[0] };
      dto.uid = undefined;
      const result = new BadRequest<Payment>(`Uid can't be empty`);
      jest.spyOn(paymentService, 'create').mockResolvedValue(result);
      try {
        await paymentController.create(dto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe(`Uid can't be empty`);
      }
    });
  });
});
