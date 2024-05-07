import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto } from './auth.dto';
import { ITokenProvider } from './user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('refresh')
  async createUser(@Body() body: RefreshDto): Promise<ITokenProvider> {
    return await this.authService.refresh(body);
  }
}
