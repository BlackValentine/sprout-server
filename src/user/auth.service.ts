import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { RefreshDto } from './auth.dto';
import { ITokenProvider } from './user.interface';
import { User } from './user.entity';
import { CurrentUser } from './decorators/currentUser.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async _createToken({ email }, refresh = false): Promise<ITokenProvider> {
    const accessToken = this.jwtService.sign({ email });
    if (!refresh) {
      const refreshToken = this.jwtService.sign(
        { email },
        {
          secret: process.env.SECRET_KEY_REFRESH,
          expiresIn: process.env.EXPIRESIN_REFRESH,
        },
      );
      return {
        expiresInRefresh: process.env.EXPIRESIN_REFRESH,
        expiresInAccess: process.env.EXPIRESIN,
        accessToken,
        refreshToken,
      };
    }
    return {
      expiresInAccess: process.env.EXPIRESIN,
      accessToken,
    };
  }

  async refresh(refreshDto: RefreshDto): Promise<ITokenProvider> {
    try {
      const payload = await this.jwtService.verify(refreshDto.refreshToken, {
        secret: process.env.SECRET_KEY_REFRESH,
      });
      const user = await this.userService.findUserByEmail(payload.email);
      const token = await this._createToken(user, true);
      return {
        accessToken: token.accessToken,
        expiresInAccess: token.expiresInAccess,
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getMe(@CurrentUser() currentUser): Promise<User> {
    return currentUser;
  }
}
