import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAddresses } from './mock-tests-data';
import { ServiceResult } from '../helpers/response/result';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

describe('AddressController', () => {
  let addressController: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressController,
        AddressService,
        { provide: getModelToken(Address.name), useValue: jest.fn() },
      ],
    }).compile();

    addressController = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  describe('findAll', () => {
    it('should return an array of addresses', async () => {
      const result = new ServiceResult<Address[]>(mockAddresses);
      jest.spyOn(addressService, 'findAll').mockResolvedValue(result);

      expect(await addressController.findAll()).toBe(result.data);
    });
  });
});
