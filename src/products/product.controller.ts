import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import {
  CreateProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './product.dto';
import { PageDto } from 'src/pagination/page.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { ROLES } from 'src/user/user.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async findProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    await this.productService.increaseProductView(id);
    return this.productService.findProductById(id);
  }

  @Get()
  @UseGuards(new RoleGuard([ROLES.USER, ROLES.USER]))
  @UseGuards(AuthGuard)
  findAll(
    @Query() productQueryDto: ProductQueryDto,
  ): Promise<PageDto<Product>> {
    return this.productService.findAll(
      {
        skip: productQueryDto.skip,
        take: productQueryDto.take,
        page: productQueryDto.page,
      },
      productQueryDto.categoryId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.productService.deleteProduct(id);
  }
}
