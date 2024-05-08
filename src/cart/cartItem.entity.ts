import { BaseEntity } from 'src/base.entity';
import { Product } from 'src/products/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  productId: number;

  @Column()
  cartId: number;

  @OneToOne(() => Product, (product) => product.cartItem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn()
  cart: Cart;
}
