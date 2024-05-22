import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsFile } from 'nestjs-form-data';
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
  @Transform(({ value }) => {
    return Number(value);
  })
  price: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value === 'true' ? true : false;
  })
  isSale: boolean;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  categoryId: number;

  @IsFile()
  @IsNotEmpty()
  image: any;

  @IsFile()
  @IsNotEmpty()
  hoverImage: any;
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
  isSale: boolean;
  isNewArrival: boolean;
}
