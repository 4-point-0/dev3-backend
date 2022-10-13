import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class NearLoginDto {
  @ApiProperty({
    type: String,
  })
  username: string;
  @ApiProperty({
    type: String,
  })
  signedJsonString: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/near')
  @ApiResponse({
    status: 200,
    description: 'The user has been logged in',
    type: Response,
  })
  nearLogin(@Body() data: NearLoginDto) {
    return this.authService.getNearJwtToken(
      data.username,
      data.signedJsonString,
    );
  }
}
