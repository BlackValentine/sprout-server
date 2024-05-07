import { BaseEntity } from 'src/base.entity';
import { Product } from 'src/products/product.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class CartItem extends BaseEntity {
  @Column()
  quantity: number;

  @OneToOne(() => Product, (product) => product.cartItem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}
