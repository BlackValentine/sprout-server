import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/pagination/page-options.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;
}

export class ProductQueryDto extends PageOptionsDto {
  categoryId: number;
}
