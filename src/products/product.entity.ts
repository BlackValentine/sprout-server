import { IsInt, Max, Min } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { CartItem } from 'src/cart/cartItem.entity';
import { Category } from 'src/category/category.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  price: number;

  @Column('int', { default: 0 })
  views: number;

  @Column('int', { default: 0 })
  likes: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  @Min(0)
  @Max(100)
  @IsInt()
  salePercentage: number;

  @Column({ default: false })
  isSale: string;

  @Column({ default: true })
  isNewArrival: boolean;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @OneToOne(() => CartItem, (cartItem) => cartItem.product)
  cartItem: CartItem;
}
