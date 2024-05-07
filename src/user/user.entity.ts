import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/base.entity';
import { Cart } from 'src/cart/cart.entity';
import { Column, Entity, OneToOne } from 'typeorm';

export enum ROLES {
  'USER',
  'ADMIN',
}

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({ default: ROLES.USER })
  role: ROLES;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
