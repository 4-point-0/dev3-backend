import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class NearRegisterUserDto {
  @ApiProperty({
    type: String,
  })
  username: string;

  @ApiProperty({
    type: String,
  })
  signedJsonString: string;

  @ApiProperty({
    enum: [Role.Admin, Role.Customer, Role.User],
  })
  roles: Role[];
}
