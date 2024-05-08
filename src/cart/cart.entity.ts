import { BaseEntity } from 'src/base.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cartItem.entity';

@Entity()
export class Cart extends BaseEntity {
  @Column({ default: 0 })
  total: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}
