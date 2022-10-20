import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongose, { Model } from 'mongoose';
import { ServiceError } from '../helpers/response/error';
import { ServiceResult } from '../helpers/response/result';
import { isNearWallet } from '../utils/nearWalletValidation';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address, AddressDocument } from './entities/address.entity';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectModel(Address.name) private repo: Model<AddressDocument>,
  ) {}

  async create(dto: CreateAddressDto): Promise<ServiceResult<Address>> {
    try {
      if (!isNearWallet(dto.wallet)) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(400, `Wallet ${dto.wallet} not valid`),
        );
      }

      const isWalletUnique = await this.repo
        .exists({ owner: dto.owner, wallet: dto.wallet })
        .exec();

      if (isWalletUnique !== null) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(400, `Wallet ${dto.wallet} isn't unique`),
        );
      }

      const isAliasUnique = await this.repo
        .exists({ owner: dto.owner, alias: dto.alias })
        .exec();

      if (isAliasUnique !== null) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(400, `Alias ${dto.alias} isn't unique`),
        );
      }

      const address = new this.repo(dto);
      const result = await address.save();
      return new ServiceResult<Address>(result);
    } catch (error) {
      this.logger.error('AddressService - create', error);
      return new ServiceResult<Address>(
        null,
        new ServiceError(500, `Can't create address`),
      );
    }
  }

  async findAll(): Promise<ServiceResult<Address[]>> {
    try {
      const addresses = await this.repo.find().populate('owner').exec();
      return new ServiceResult<Address[]>(addresses);
    } catch (error) {
      this.logger.error('AddressService - findAll', error);
      return new ServiceResult<Address[]>(
        null,
        new ServiceError(500, `Can't get addresses`),
      );
    }
  }

  async update(
    id: string,
    userUid: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ServiceResult<Address>> {
    try {
      if (!Mongose.Types.ObjectId.isValid(id)) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, 'Address not found'),
        );
      }

      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, `Address not found`),
        );
      }

      if (address.owner.uid !== userUid) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(401, `Unauthorized access to user address`),
        );
      }

      const updateAddress = await this.repo
        .findByIdAndUpdate(id, updateAddressDto)
        .exec();
      return new ServiceResult<Address>(updateAddress);
    } catch (error) {
      this.logger.error('AddressService - update', error);
      return new ServiceResult<Address>(
        null,
        new ServiceError(500, `Can't update address`),
      );
    }
  }

  async findOne(id: string): Promise<ServiceResult<Address>> {
    try {
      if (!Mongose.Types.ObjectId.isValid(id)) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, 'Address not found'),
        );
      }
      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, 'Address not found'),
        );
      }
      return new ServiceResult<Address>(address);
    } catch (error) {
      this.logger.error('AddressService - findOne', error);
      return new ServiceResult<Address>(
        null,
        new ServiceError(500, `Can't get address`),
      );
    }
  }

  async remove(id: string): Promise<ServiceResult<Address>> {
    try {
      if (!Mongose.Types.ObjectId.isValid(id)) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, `Address not found`),
        );
      }

      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new ServiceResult<Address>(
          null,
          new ServiceError(404, 'Address not found'),
        );
      }

      const result = await this.repo.findByIdAndDelete(id).exec();
      return new ServiceResult<Address>(result);
    } catch (error) {
      this.logger.error('AddressService - findOne', error);
      return new ServiceResult<Address>(
        null,
        new ServiceError(500, `Can't remove address`),
      );
    }
  }
}
