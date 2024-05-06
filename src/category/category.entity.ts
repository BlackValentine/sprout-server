import { BaseEntity } from 'src/base.entity';
import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
