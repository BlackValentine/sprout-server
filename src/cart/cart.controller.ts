import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCartItemDto } from './cartItem.dto';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/currentUser.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post(':cartId/add-item/:productId')
  async addItemToCart(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateCartItemDto,
    @CurrentUser() currentUser,
  ) {
    return this.cartService.addItemToCart(
      body,
      cartId,
      productId,
      currentUser.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':cartId')
  async getCartById(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.getCartById(cartId);
  }

  @UseGuards(AuthGuard)
  @Delete(':cartId/remove-item/:productId')
  async deleteCartItem(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.deleteCartItem(cartId, productId);
  }
}
