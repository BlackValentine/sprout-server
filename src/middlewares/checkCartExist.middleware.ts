import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CheckCartExist implements NestMiddleware {
  constructor(private readonly cartService: CartService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params;
    const cart = await this.cartService.getCartById(+cartId);
    if (!cart) {
      throw new HttpException('Cart is not exist.', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
