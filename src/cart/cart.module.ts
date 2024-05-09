import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';
import { ProductModule } from 'src/products/product.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { CheckCartExist } from 'src/middlewares/checkCartExist.middleware';
import { CheckProductExist } from 'src/middlewares/checkProductExist.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductModule,
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService, JwtService, ConfigService],
})
export class CartModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckCartExist).forRoutes('cart/:cartId');
    consumer
      .apply(CheckCartExist, CheckProductExist)
      .forRoutes(':cartId/remove-item/:productId');
    consumer.apply(CheckProductExist).forRoutes(':cartId/add-item/:productId');
  }
}
