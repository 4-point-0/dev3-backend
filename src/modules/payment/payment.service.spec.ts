import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCreatePaymentDtos,
  mockPayments,
  mockProjects,
  mockUser,
} from '../../../test/mock-tests-data';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { Project, ProjectSchema } from '../project/entities/project.entity';
import { File, FileSchema } from '../file/entities/file.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { ProjectService } from '../project/project.service';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let paymentModel: Model<Payment>;
  let projectModel: Model<Project>;
  let userModel: Model<User>;
  let fileModel: Model<File>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    paymentModel = mongoConnection.model(Payment.name, PaymentSchema);
    projectModel = mongoConnection.model(Project.name, ProjectSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    fileModel = mongoConnection.model(File.name, FileSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        ProjectService,
        { provide: getModelToken(Payment.name), useValue: paymentModel },
        { provide: getModelToken(File.name), useValue: fileModel },
        { provide: getModelToken(Project.name), useValue: projectModel },
        { provide: getModelToken(User.name), useValue: userModel },
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
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const createdPayment = await paymentService.create(
      mockCreatePaymentDtos[0],
    );
    expect(createdPayment.data._id).toBeDefined();
    expect(createdPayment.data.uuid).toBeDefined();
  });

  it(`Create - should return Receiver not valid (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    dto.receiver = '123';
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Receiver ${dto.receiver} not valid`),
    );
  });

  it(`Create - should return Amount can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    delete dto.amount;
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Amount can't be empty`),
    );
  });

  it(`Create - should return Project id can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const dto = { ...mockCreatePaymentDtos[0] };
    delete dto.project_id;
    const response = await paymentService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Payment>(`Project id can't be empty`),
    );
  });

  it(`FindAll - should findAll`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    const result = await paymentService.findAll(
      mockUser._id,
      mockCreatePaymentDtos[0].project_id,
    );
    expect(result.data.results).toHaveLength(2);
  });

  it(`FindAll - should findAll with total count`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    const result = await paymentService.findAll(
      mockUser._id,
      mockCreatePaymentDtos[0].project_id,
    );
    expect(result.data.total).toEqual(2);
    expect(result.data.count).toEqual(2);
  });

  it(`FindAll - should findAll with total count, limit, offset`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    await paymentService.create(mockCreatePaymentDtos[2]);
    await paymentService.create(mockCreatePaymentDtos[3]);
    const limit = 2;
    const offset = 2;
    const result = await paymentService.findAll(
      mockUser._id,
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
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await paymentService.create(mockCreatePaymentDtos[0]);
    await paymentService.create(mockCreatePaymentDtos[1]);
    await paymentService.create(mockCreatePaymentDtos[2]);
    await paymentService.create(mockCreatePaymentDtos[3]);
    const limit = 2;
    const offset = 0;
    const status = PaymentStatus.Pending;
    const result = await paymentService.findAll(
      mockUser._id,
      mockCreatePaymentDtos[0].project_id,
      offset,
      limit,
      null,
      null,
      status,
    );
    expect(result.data.total).toEqual(4);
    expect(result.data.offset).toEqual(offset);
    expect(result.data.limit).toEqual(limit);
    expect(result.data.count).toEqual(limit);
    expect(result.data.results[0].status).toEqual(status);
    expect(result.data.results[1].status).toEqual(status);
  });

  it(`FindOne - should findOne`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const createResult = await paymentService.create(mockCreatePaymentDtos[0]);

    const result = await paymentService.findOne(
      createResult.data._id.toString(),
      mockUser._id.toString(),
    );

    expect(result.data.amount).toBe(mockCreatePaymentDtos[0].amount);
  });

  it(`FindOne - should return Payment not found (Not Found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new paymentModel(mockPayments[0]).save();
    const response = await paymentService.findOne(
      '12',
      mockUser._id.toString(),
    );
    expect(response).toStrictEqual(new NotFound<Payment>('Payment not found'));
  });

  it(`FindOne - should return Payment not found (Not Found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new paymentModel(mockPayments[0]).save();
    const response = await paymentService.findOne(
      '634ff1e4bb81ed5475a1ff6d',
      mockUser._id.toString(),
    );
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
