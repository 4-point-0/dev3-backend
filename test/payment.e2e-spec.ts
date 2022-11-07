import { Test } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  mockPayments,
  mockAuthUser,
  mockCreatePaymentDtos,
  mockPaymentDto,
} from './mock-tests-data';
import { JwtAuthGuard } from '../src/modules/auth/common/jwt-auth.guard';
import { ServiceResult } from '../src/helpers/response/result';
import { Payment } from '../src/modules/payment/entities/payment.entity';
import { PaginatedDto } from '../src/common/pagination/paginated-dto';
import { PaymentService } from '../src/modules/payment/payment.service';
import { PaymentModule } from '../src/modules/payment/payment.module';
import { PaymentStatus } from '../src/common/enums/payment-status.enum';
import { PaymentDto } from '../src/modules/payment/dto/payment.dto';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  const updatePayment = { ...mockPaymentDto };
  updatePayment.status = PaymentStatus.Paid;
  const projectService = {
    create: () => new ServiceResult<Payment>(mockPayments[0]),
    findAll: () =>
      new ServiceResult<PaginatedDto<Payment>>({
        total: 4,
        offset: 0,
        limit: 0,
        results: mockPayments,
      }),
    findOne: () => new ServiceResult<PaymentDto>(mockPaymentDto),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PaymentModule],
    })
      .overrideProvider(PaymentService)
      .useValue(projectService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockAuthUser;
          return true;
        },
      })

      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payment (POST) create', async () => {
    const response = await request(app.getHttpServer())
      .post('/payment')
      .send(mockCreatePaymentDtos[0]);
    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(
      projectService.create().data._id.toString(),
    );
  });

  it('/payment (GET) all projects', async () => {
    const response = await request(app.getHttpServer()).get('/payment');
    expect(response.status).toEqual(200);
    expect(response.body.results.length).toEqual(
      projectService.findAll().data.results.length,
    );
  });

  it('/payment (GET) one', async () => {
    const id = '784ff1e4bb85ed5475a1ff5d';
    const response = await request(app.getHttpServer()).get(`/payment/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(id);
  });
});
