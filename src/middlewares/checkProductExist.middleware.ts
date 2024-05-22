import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class CheckProductExist implements NestMiddleware {
  constructor(private readonly productService: ProductService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;
    const product = await this.productService.findProductById(+productId);
    if (!product) {
      throw new HttpException('Product is not exist.', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
