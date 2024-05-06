import { BaseEntity } from 'src/base.entity';
import { Column, Entity } from 'typeorm';

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
}
