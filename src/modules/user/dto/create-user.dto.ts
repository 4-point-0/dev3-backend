import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  uid: string;
  accountType: string;
  username: string;
  nearWalletAccountId: string;
  roles?: Role[];
}
