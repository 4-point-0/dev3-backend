import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceResult } from '../../helpers/response/result';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistsDto } from './dto/user-exists.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private repo: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const created = new this.repo(createUserDto);
    return created.save();
  }

  findOne(uid: string): Promise<User> {
    return this.repo
      .findOne({ $or: [{ uid }, { nearWalletAccountId: uid }] })
      .exec();
  }

  async exists(dto: UserExistsDto): Promise<ServiceResult<boolean>> {
    let exists = true;
    const user = await this.repo.exists({ username: dto.username }).exec();
    if (!user) exists = false;

    return new ServiceResult<boolean>(exists);
  }
}
