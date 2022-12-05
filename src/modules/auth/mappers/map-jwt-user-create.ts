import { CreateUserDto } from '../../user/dto/create-user.dto';
import { JwtUser } from '../dto/jwt-user';

export const mapJwtUserCreate = (jwtUser: JwtUser): CreateUserDto => {
  return {
    uid: jwtUser.uid,
    username: jwtUser.username,
    accountType: jwtUser.accountType,
    nearWalletAccountId:
      jwtUser.accountType === 'near' ? jwtUser.username : null,
    roles: jwtUser.roles,
  };
};
