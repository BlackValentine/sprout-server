import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      //1. Get token from header
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new ForbiddenException('Please provide access token');
      }
      //2. jwtVerify validate token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      //3. find user in database
      const user = await this.userService.findUserByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('User not belong to token');
      }
      //4. assign user to request object
      request.currentUser = user;
    } catch (error) {
      throw new ForbiddenException('Invalid token or expired');
    }
    return true;
  }
}
