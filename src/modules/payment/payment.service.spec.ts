import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCreatePaymentDtos,
  mockPayments,
  mockProjects,
} from '../../../test/mock-tests-data';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { Project, ProjectSchema } from '../project/entities/project.entity';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let paymentModel: Model<Payment>;
  let projectModel: Model<Project>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    paymentModel = mongoConnection.model(Payment.name, PaymentSchema);
    projectModel = mongoConnection.model(Project.name, ProjectSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getModelToken(Payment.name), useValue: paymentModel },
        { provide: getModelToken(Project.name), useValue: projectModel },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('Create - should return the saved object', async () => {
    await new projectModel(mockProjects[0]).save();
    const createdPayment = await paymentService.create(
      mockCreatePaymentDtos[0],
    );
    expect(createdPayment.data.uid).toBe(mockCreatePaymentDtos[0].uid);
  });

  it(`Create - should return Receiver not valid (Bad Request - 400) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    dto.receiver = '123';
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Receiver ${dto.receiver} not valid`),
    );
  });

  it(`Create - should return Uid can't be empty (Bad Request - 400) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    delete dto.uid;
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Uid can't be empty`),
    );
  });

  it(`Create - should return Amount can't be empty (Bad Request - 400) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    delete dto.amount;
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Amount can't be empty`),
    );
  });

  it(`Create - should return Project id can't be empty (Bad Request - 400) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    delete dto.project_id;
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Project id can't be empty`),
    );
  });

  it(`FindAll - should findAll`, async () => {
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    const result = await paymentService.findAll(
      mockCreatePaymentDtos[0].project_id,
    );

    expect(result.data.results).toHaveLength(2);
  });

  it(`FindAll - should findAll with total count`, async () => {
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    const result = await paymentService.findAll(
      mockCreatePaymentDtos[0].project_id,
    );
    expect(result.data.total).toEqual(2);
    expect(result.data.count).toEqual(2);
  });

  it(`FindAll - should findAll with total count, limit, offset`, async () => {
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    await paymentService.create(mockCreatePaymentDtos[2]);
    await paymentService.create(mockCreatePaymentDtos[3]);
    const limit = 2;
    const offset = 2;
    const result = await paymentService.findAll(
      mockCreatePaymentDtos[0].project_id,
      offset,
      limit,
    );
    expect(result.data.total).toEqual(4);
    expect(result.data.offset).toEqual(offset);
    expect(result.data.limit).toEqual(limit);
    expect(result.data.count).toEqual(limit);
    expect(result.data.results).toHaveLength(limit);
  });

  it(`FindAll - should findAll with total count, limit, offset, filter by uid, status`, async () => {
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    await paymentService.create(mockCreatePaymentDtos[2]);
    await paymentService.create(mockCreatePaymentDtos[3]);
    const limit = 2;
    const offset = 0;
    const uid = 'bob.dev3.testnet';
    const status = PaymentStatus.Pending;
    const result = await paymentService.findAll(
      mockCreatePaymentDtos[0].project_id,
      offset,
      limit,
      uid,
      null,
      null,
      status,
    );
    expect(result.data.total).toEqual(4);
    expect(result.data.offset).toEqual(offset);
    expect(result.data.limit).toEqual(limit);
    expect(result.data.count).toEqual(limit);
    expect(result.data.results[0].uid).toMatch(mockCreatePaymentDtos[0].uid);
    expect(result.data.results[0].status).toEqual(status);
    expect(result.data.results[1].uid).toMatch(mockCreatePaymentDtos[3].uid);
    expect(result.data.results[1].status).toEqual(status);
  });

  it(`FindOne - should findOne`, async () => {
    await new projectModel(mockProjects[0]).save();
    const createResult = await paymentService.create(mockCreatePaymentDtos[0]);

    const result = await paymentService.findOne(
      createResult.data._id.toString(),
    );

    expect(result.data.amount).toBe(mockCreatePaymentDtos[0].amount);
  });

  it(`FindOne - should return Payment not found (Not Found - 404) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    await new paymentModel(mockPayments[0]).save();
    const response = await paymentService.findOne('12');
    expect(response).toStrictEqual(new NotFound<Payment>('Payment not found'));
  });

  it(`FindOne - should return Payment not found (Not Found - 404) exception`, async () => {
    await new projectModel(mockProjects[0]).save();
    await new paymentModel(mockPayments[0]).save();
    const response = await paymentService.findOne('634ff1e4bb81ed5475a1ff6d');
    expect(response).toStrictEqual(new NotFound<Payment>('Payment not found'));
  });

  it(`Update - should update`, async () => {
    await new projectModel(mockProjects[0]).save();
    await new paymentModel(mockPayments[0]).save();
    const res = {
      payload: {
        Events: {
          data: '[{"amount":"12","memo":"784ff1e4bb85ed5475a1ff5d","new_owner_id":"bob.rimatikdev.testnet","old_owner_id":"rimatikdev.testnet"}]',
        },
      },
    };

    const result = await paymentService.updatePagoda(res);
    expect(result.data.status).toBe(PaymentStatus.Paid);
  });
});
