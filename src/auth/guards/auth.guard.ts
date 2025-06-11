import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.get<boolean>(
      'isProtected',
      context.getHandler(),
    );

    if (!isProtected) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (typeof request.session?.userId === 'undefined') {
      throw new UnauthorizedException('Please login to access this resource');
    }

    const user = await this.usersService.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
