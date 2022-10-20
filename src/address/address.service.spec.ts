import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAddresses, mockCreateAddressDtos } from './mock-tests-data';
import { ServiceResult } from '../helpers/response/result';
import { AddressService } from './address.service';
import { Address, AddressSchema } from './entities/address.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { ServiceError } from '../helpers/response/error';

describe('AddressService', () => {
  let addressService: AddressService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let addressModel: Model<Address>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    addressModel = mongoConnection.model(Address.name, AddressSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: getModelToken(Address.name), useValue: addressModel },
      ],
    }).compile();

    addressService = module.get<AddressService>(AddressService);
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

  describe('CreateAddress', () => {
    it('should return the saved object', async () => {
      const createdAddress = await addressService.create(
        mockCreateAddressDtos[0],
      );
      expect(createdAddress.data.wallet).toBe(mockCreateAddressDtos[0].wallet);
    });

    it(`should return Wallet isn't unique (Bad Request - 400) exception`, async () => {
      await new addressModel(mockCreateAddressDtos[0]).save();
      const response = await addressService.create(mockCreateAddressDtos[0]);
      expect(response).toStrictEqual(
        new ServiceResult<Address>(
          null,
          new ServiceError(
            400,
            `Wallet ${mockCreateAddressDtos[0].wallet} isn't unique`,
          ),
        ),
      );
    });

    it(`should return Wallet not valid (Bad Request - 400) exception`, async () => {
      await mongoConnection.db
        .collection('address')
        .insertOne(mockAddresses[0]);
      const wallet = 'bob';
      const dtoWallet = { ...mockCreateAddressDtos[0] };
      dtoWallet.wallet = wallet;
      const response = await addressService.create(dtoWallet);
      expect(response).toStrictEqual(
        new ServiceResult<Address>(
          null,
          new ServiceError(400, `Wallet ${wallet} not valid`),
        ),
      );
    });
  });
});
