import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { CreateCartItemDto } from './cartItem.dto';
import { ProductService } from 'src/products/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly productService: ProductService,
  ) {}

  async getCartById(cardId: number): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: {
        id: cardId,
      },
      relations: ['cartItems.product'],
    });
    if (!cart) {
      throw new HttpException('Cart is not existed', HttpStatus.BAD_REQUEST);
    }
    return cart;
  }

  async deleteCartItem(cartId: number, productId: number): Promise<any> {
    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new HttpException('Product is not exist', HttpStatus.BAD_REQUEST);
    }

    const currentCart = await this.cartRepo.findOne({
      where: {
        id: cartId,
      },
    });
    if (!currentCart) {
      throw new HttpException('Cart is not exist', HttpStatus.BAD_REQUEST);
    }
    const existCartItem = await this.cartItemRepo.findOne({
      where: {
        productId,
        cartId,
      },
    });
    if (!existCartItem) {
      throw new HttpException('Cart item is not exist', HttpStatus.BAD_REQUEST);
    }
    const price = product.price * existCartItem.quantity;
    await this.cartItemRepo.delete(existCartItem.id);
    await this.cartRepo.update(currentCart.id, {
      total: currentCart.total - price,
    });

    return this.cartRepo.findOneOrFail({
      where: { id: currentCart.id },
      relations: ['cartItems'],
    });
  }

  async addItemToCart(
    item: CreateCartItemDto,
    cartId: number,
    productId: number,
    userId: number,
  ): Promise<Cart> {
    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new HttpException('Product is not exist', HttpStatus.BAD_REQUEST);
    }
    const price = product.price * item.quantity;

    let currentCart: Cart;
    const existCart = await this.cartRepo.findOne({
      where: {
        id: cartId,
      },
    });
    if (!existCart) {
      currentCart = this.cartRepo.create({ userId });
      await this.cartRepo.save(currentCart);
    } else {
      currentCart = { ...existCart };
    }

    await this.cartRepo.update(cartId, {
      total: currentCart.total + price,
    });

    const existCartItem = await this.cartItemRepo.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!existCartItem) {
      const cartItem = this.cartItemRepo.create({
        ...item,
        cartId,
      });
      await this.cartItemRepo.save(cartItem);
    } else {
      await this.cartItemRepo.update(existCartItem.id, {
        quantity: existCartItem.quantity + item.quantity,
      });
    }

    return this.cartRepo.findOneOrFail({
      where: { id: cartId },
    });
  }
}
