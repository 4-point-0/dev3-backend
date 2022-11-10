import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { shouldBypassAuth } from './bypass-auth';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (shouldBypassAuth(context, this.reflector)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];

    if (!bearer) return false;

    let token = bearer.split(' ')[1];

    if (token && token.includes(',')) {
      token = token.replace(',', '');
      request.headers['authorization'] = `Bearer ${token}`;
    }
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }
  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
