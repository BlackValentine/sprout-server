import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto } from './auth.dto';
import { ITokenProvider } from './user.interface';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('refresh')
  async createUser(@Body() body: RefreshDto): Promise<ITokenProvider> {
    return await this.authService.refresh(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() currentUser): Promise<User> {
    return this.authService.getMe(currentUser);
  }
}
