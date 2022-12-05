import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ServiceResult } from '../../helpers/response/result';
import { JwtTokenDto } from './dto/jwt-token.dto';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { ConfigService } from '@nestjs/config';
import { NearRegisterUserDto } from './dto/near-register-user.dto';
import {
  getNearPublicKey,
  nearValidatePublicKeyByAccountId,
} from '../../helpers/near/near-helper';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  async getNearJwtToken(
    username: string,
    signedJsonString: string,
  ): Promise<ServiceResult<JwtTokenDto>> {
    try {
      const publicKey = await getNearPublicKey(username, signedJsonString);

      if (!publicKey) {
        return new BadRequest('Invalid signature');
      }

      const pK_of_account = await nearValidatePublicKeyByAccountId(
        username,
        publicKey,
        this.configService.get('NODE_ENV'),
      );

      if (!pK_of_account) {
        return new BadRequest('Invalid public key');
      }

      const user = await this.userService.findOne(username);
      if (!user) {
        return new NotFound('User not found!');
      }

      const dto = {
        token: this.jwtService.sign(user),
      };

      return new ServiceResult<JwtTokenDto>(dto);
    } catch (error) {
      this.logger.error('AuthService - getNearJwtToken', error);
      return new ServerError<JwtTokenDto>(`Can't get jwt token`);
    }
  }

  async registerNearUser(
    dto: NearRegisterUserDto,
  ): Promise<ServiceResult<User>> {
    try {
      const publicKey = await getNearPublicKey(
        dto.username,
        dto.signedJsonString,
      );

      if (!publicKey) {
        return new BadRequest('Invalid signature');
      }

      const pK_of_account = await nearValidatePublicKeyByAccountId(
        dto.username,
        publicKey,
        this.configService.get('NODE_ENV'),
      );

      if (!pK_of_account) {
        return new BadRequest('Invalid public key');
      }
      const user = await this.userService.findOne(dto.username);

      if (user) {
        return new BadRequest('User already exists!');
      }

      const newUser = await this.userService.create({
        uid: dto.username,
        accountType: 'near',
        username: dto.username,
        nearWalletAccountId: dto.username,
        roles: dto.roles,
      });

      return new ServiceResult<User>(newUser);
    } catch (error) {
      this.logger.error('AuthService - registerNearUser', error);
      return new ServerError<User>(`Can't register user`);
    }
  }
}
