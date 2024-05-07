import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto, LoginDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ITokenProvider } from './user.interface';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async createUser(@Body() body: RegisterDto): Promise<User> {
    return await this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<ITokenProvider> {
    return await this.userService.login(body);
  }
}
