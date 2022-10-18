import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceError } from 'src/common/models/ServiceError';
import { ServiceResult } from 'src/common/models/ServiceResult';
import { isNearWallet } from 'src/utils/nearWalletValidation';
import { CreateAddressDto } from './dto/create-address.dto';
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
        new ServiceError(500, `Server error`),
      );
    }
  }
}
