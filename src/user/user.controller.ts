import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/common/jwt-auth.guard';
import { AuthRequest, User } from './entities/user.entity';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, type: User })
  findMe(@Req() request: AuthRequest) {
    return request.user;
  }
}
