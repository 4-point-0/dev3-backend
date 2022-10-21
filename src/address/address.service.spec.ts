import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAddresses,
  mockCreateAddressDtos,
  mockUser,
} from './mock-tests-data';
import { ServiceResult } from '../helpers/response/result';
import { AddressService } from './address.service';
import { Address, AddressSchema } from './entities/address.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { ServiceError } from '../helpers/response/error';

describe('AddressService', () => {
  let addressService: AddressService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let addressModel: Model<Address>;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    addressModel = mongoConnection.model(Address.name, AddressSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: getModelToken(Address.name), useValue: addressModel },
        { provide: getModelToken(User.name), useValue: userModel },
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

  it('Create - should return the saved object', async () => {
    const createdAddress = await addressService.create(
      mockCreateAddressDtos[0],
    );
    expect(createdAddress.data.wallet).toBe(mockCreateAddressDtos[0].wallet);
  });

  it(`Create - should return Wallet not valid (Bad Request - 400) exception`, async () => {
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

  it(`Create - should return Wallet not valid (Bad Request - 400) exception`, async () => {
    const wallet = 'test.hear';
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

  it(`Create - should return Wallet not valid (Bad Request - 400) exception`, async () => {
    const wallet =
      '1984ad0c5eacf3bedc550bc2c72e28e5d534bd1ae25a5194a527d5b4c0b87f2d3';
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

  it(`Create - should return Wallet not valid (Bad Request - 400) exception`, async () => {
    const wallet =
      '1984ad0c5eacf3bedc550bc2c72e28e5d534bd1ae25a5194a527d5b4c0b87f2';
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

  it(`Create - should return Wallet isn't unique (Bad Request - 400) exception`, async () => {
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

  it(`Create - should return Alias isn't unique (Bad Request - 400) exception`, async () => {
    await new addressModel(mockCreateAddressDtos[0]).save();
    const wallet = 'johhnyy3.near';
    const dtoWallet = { ...mockCreateAddressDtos[0] };
    dtoWallet.wallet = wallet;
    const response = await addressService.create(dtoWallet);
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(
          400,
          `Alias ${mockCreateAddressDtos[0].alias} isn't unique`,
        ),
      ),
    );
  });

  it(`FindAll - should findAll`, async () => {
    await new addressModel(mockAddresses[0]).save();
    await new addressModel(mockAddresses[1]).save();
    const result = await addressService.findAll();
    expect(result.data).toHaveLength(2);
  });

  it(`FindOne - should findOne`, async () => {
    const createResult = await new addressModel(mockAddresses[0]).save();
    const result = await addressService.findOne(createResult._id.toString());
    expect(result.data.wallet).toBe(mockCreateAddressDtos[0].wallet);
  });

  it(`FindOne - should return Address not found (Not Found - 404) exception`, async () => {
    await new addressModel(mockAddresses[0]).save();
    const response = await addressService.findOne('12');
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`FindOne - should return Address not found (Not Found - 404) exception`, async () => {
    await new addressModel(mockAddresses[0]).save();
    const response = await addressService.findOne('634ff1e4bb85ed5475a1ff6d');
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`Update - should update`, async () => {
    const userResult = await new userModel(mockUser).save();
    const createResult = await new addressModel(mockAddresses[0]).save();
    const phone = '+38599345684';
    const email = 'alice@email.com';
    const result = await addressService.update(
      createResult._id.toString(),
      userResult.uid,
      { phone: phone, email: email },
    );
    expect(result.data.phone).toBe(phone);
    expect(result.data.email).toBe(email);
  });

  it(`Update - should return Address not found (Not Found - 404) exception`, async () => {
    const userResult = await new userModel(mockUser).save();
    await new addressModel(mockAddresses[0]).save();
    const phone = '+38599345684';
    const email = 'alice@email.com';
    const response = await addressService.update('12', userResult.uid, {
      phone: phone,
      email: email,
    });
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`Update - should return Address not found (Not Found - 404) exception`, async () => {
    const userResult = await new userModel(mockUser).save();
    await new addressModel(mockAddresses[0]).save();
    const phone = '+38599345684';
    const email = 'alice@email.com';
    const response = await addressService.update(
      '634ff1e4bb85ed5475a1ff50',
      userResult.uid,
      {
        phone: phone,
        email: email,
      },
    );
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`Update - should return Unauthorized access to user address (Not Found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    const createResult = await new addressModel(mockAddresses[0]).save();
    const phone = '+38599345684';
    const email = 'alice@email.com';
    const response = await addressService.update(
      createResult._id.toString(),
      'bobby.near',
      {
        phone: phone,
        email: email,
      },
    );
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(401, `Unauthorized access to user address`),
      ),
    );
  });

  it(`Remove - should delete one`, async () => {
    const createResult = await new addressModel(mockAddresses[0]).save();
    await addressService.remove(createResult._id.toString());
    const response = await addressService.findOne(createResult._id.toString());

    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`Remove - should return Address not found (Not Found - 404) exception`, async () => {
    await new addressModel(mockAddresses[0]).save();
    const response = await addressService.remove(
      mockAddresses[1]._id.toString(),
    );
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  it(`Remove - should return Address not found (Not Found - 404) exception`, async () => {
    await new addressModel(mockAddresses[0]).save();
    const response = await addressService.remove('12');
    expect(response).toStrictEqual(
      new ServiceResult<Address>(
        null,
        new ServiceError(404, `Address not found`),
      ),
    );
  });

  // it(`FindOne - should return Address not found (Not Found - 404) exception`, async () => {
  //   await new addressModel(mockAddresses[0]).save();
  //   const response = await addressService.findOne('12');
  //   expect(response).toStrictEqual(
  //     new ServiceResult<Address>(
  //       null,
  //       new ServiceError(404, `Address not found`),
  //     ),
  //   );
  // });

  // it(`FindOne - should return Address not found (Not Found - 404) exception`, async () => {
  //   await new addressModel(mockAddresses[0]).save();
  //   const response = await addressService.findOne('634ff1e4bb85ed5475a1ff6d');
  //   expect(response).toStrictEqual(
  //     new ServiceResult<Address>(
  //       null,
  //       new ServiceError(404, `Address not found`),
  //     ),
  //   );
  // });
});
