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
import { NotFound } from '../../helpers/response/errors';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { PaymentDto } from './dto/payment.dto';
import { Project } from '../project/entities/project.entity';
import { ConfigModule } from '@nestjs/config';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          load: [() => ({ pagoda_bearer: '123' })],
        }),
      ],
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
        count: 4,
        limit: 0,
        offset: 0,
        results: mockPayments,
      });
      jest.spyOn(paymentService, 'findAll').mockResolvedValue(result);
      const req: any = {
        user: mockAuthUser,
      };
      const response = await paymentController.findAll(
        req,
        mockPayments[0].project._id.toString(),
      );
      expect(response).toBe(result.data);
    });
  });

  describe('findById', () => {
    it('should return one payment by id', async () => {
      const req: any = {
        user: mockAuthUser,
      };
      const result = new ServiceResult<PaymentDto>(mockPaymentDto);
      jest.spyOn(paymentService, 'findOne').mockResolvedValue(result);
      const response = await paymentController.findById(
        req,
        mockPaymentDto._id,
      );

      expect(response).toBe(result.data);
    });

    it('should return Payment not found (Not Found - 404) exception', async () => {
      const req: any = {
        user: mockAuthUser,
      };
      const result = new NotFound<PaymentDto>('Payment not found');
      jest.spyOn(paymentService, 'findOne').mockResolvedValue(result);
      try {
        await paymentController.findById(req, '624ff1e4bb85ed5475a1ff5d');
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Payment not found');
      }
    });
  });

  describe('create', () => {
    it('should create one payment', async () => {
      const req: any = {
        user: mockAuthUser,
      };
      const result = new ServiceResult<Payment>(mockPayments[0]);
      jest.spyOn(paymentService, 'create').mockResolvedValue(result);
      const response = await paymentController.create(
        req,
        mockCreatePaymentDtos[0],
      );
      expect(response).toBe(result.data);
    });
  });
});
