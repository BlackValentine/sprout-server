import { BaseEntity } from 'src/base.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Blog extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  subTitle: string;

  @Column('text')
  content: string;

  @Column()
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => User, (user) => user.blog, { onDelete: 'SET NULL' })
  author: User;
}
