import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { ITokenProvider } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });
    if (existUser) {
      throw new HttpException('Email already exists.', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userRepository.create({
      ...registerDto,
      password: hashPassword,
    });
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<ITokenProvider> {
    const existUser = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
    });
    if (!existUser) {
      throw new HttpException(
        'Email or password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(loginDto.password, existUser.password);
    if (!isMatch) {
      throw new HttpException(
        'Email or password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = await this.authService._createToken(existUser, false);
    return token;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['cart.cartItems.product'],
    });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
