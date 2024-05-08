import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
