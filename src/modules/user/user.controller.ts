import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { handle } from 'src/helpers/response/handle';
import { UserExistsDto } from './dto/user-exists.dto';
import { AuthRequest, User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@UseGuards(AuthGuard(['jwt', 'api-key']))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @Get('me')
  @ApiResponse({ status: 200, type: User })
  findMe(@Req() request: AuthRequest) {
    return request.user;
  }

  @Get('exists')
  @ApiResponse({ status: 200, type: Boolean })
  async exists(@Body() dto: UserExistsDto) {
    return handle(await this.userService.exists(dto));
  }
}
