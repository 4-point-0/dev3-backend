import { Role } from '../../../common/enums/role.enum';

export interface JwtUser {
  uid: string;
  username: string;
  accountType: string;
  roles: Role[];
}
