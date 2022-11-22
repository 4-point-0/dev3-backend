import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyModule } from '../api-key/api-key.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './common/api-key.strategy';
import { jwtConstants } from './common/jwt-constants';
import { JwtStrategy } from './common/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    HttpModule,
    ApiKeyModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
