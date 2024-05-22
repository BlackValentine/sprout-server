import { IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  subTitle: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  thumbnail: string;

  authorId: string;
}
