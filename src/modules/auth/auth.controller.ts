import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { handle } from '../../helpers/response/handle';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { NearLoginRequestDto } from './dto/near-login-request.dto';
import { NearLoginResponseDto } from './dto/near-login-response.dto';
import { NearRegisterUserDto } from './dto/near-register-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/near')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in',
    type: NearLoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  async login(@Body() data: NearLoginRequestDto) {
    return handle(
      await this.authService.getNearJwtToken(
        data.username,
        data.signedJsonString,
      ),
    );
  }

  @Post('/near-register')
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @HttpCode(200)
  async register(@Body() dto: NearRegisterUserDto) {
    return handle(await this.authService.registerNearUser(dto));
  }
}
