import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Mongoose, { Model } from 'mongoose';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../helpers/response/errors';
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
        return new BadRequest<Address>(`Wallet ${dto.wallet} not valid`);
      }

      const addressWalletDoc = await this.repo
        .exists({ owner: dto.owner, wallet: dto.wallet })
        .exec();

      if (addressWalletDoc) {
        return new BadRequest<Address>(`Wallet ${dto.wallet} isn't unique`);
      }

      const addressAliasDoc = await this.repo
        .exists({ owner: dto.owner, alias: dto.alias })
        .exec();

      if (addressAliasDoc) {
        return new BadRequest<Address>(`Alias ${dto.alias} isn't unique`);
      }
      const result = await new this.repo(dto).save();
      return new ServiceResult<Address>(result);
    } catch (error) {
      this.logger.error('AddressService - create', error);
      return new ServerError<Address>(`Can't create address`);
    }
  }

  async findAll(): Promise<ServiceResult<Address[]>> {
    try {
      const addresses = await this.repo.find().populate('owner').exec();
      return new ServiceResult<Address[]>(addresses);
    } catch (error) {
      this.logger.error('AddressService - findAll', error);
      return new ServerError<Address[]>(`Can't get addresses`);
    }
  }

  async update(
    id: string,
    userUid: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ServiceResult<Address>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Address>('Address not found');
      }

      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new NotFound<Address>('Address not found');
      }

      if (address.owner.uid !== userUid) {
        return new Unauthorized<Address>('Unauthorized access to user address');
      }

      const updateAddress = await this.repo.findOne({ _id: id }).exec();
      updateAddress.phone = updateAddressDto.phone;
      updateAddress.email = updateAddressDto.email;
      await this.repo.updateOne({ _id: id }, updateAddress);
      return new ServiceResult<Address>(updateAddress);
    } catch (error) {
      this.logger.error('AddressService - update', error);
      return new ServerError<Address>(`Can't update address`);
    }
  }

  async findOne(id: string): Promise<ServiceResult<Address>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Address>('Address not found');
      }
      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new NotFound<Address>('Address not found');
      }
      return new ServiceResult<Address>(address);
    } catch (error) {
      this.logger.error('AddressService - findOne', error);
      return new ServerError<Address>(`Can't get address`);
    }
  }

  async remove(id: string): Promise<ServiceResult<Address>> {
    try {
      if (!Mongoose.Types.ObjectId.isValid(id)) {
        return new NotFound<Address>('Address not found');
      }

      const address = await this.repo
        .findOne({ _id: id })
        .populate('owner')
        .exec();

      if (!address) {
        return new NotFound<Address>('Address not found');
      }

      const result = await this.repo.findByIdAndDelete(id).exec();
      return new ServiceResult<Address>(result);
    } catch (error) {
      this.logger.error('AddressService - findOne', error);
      return new ServerError<Address>(`Can't remove address`);
    }
  }
}
