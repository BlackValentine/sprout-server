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
import { FormDataRequest } from 'nestjs-form-data';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':productId')
  async findProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Product> {
    await this.productService.increaseProductView(productId);
    return this.productService.findProductById(productId);
  }

  @Get()
  // @UseGuards(new RoleGuard([ROLES.USER, ROLES.ADMIN]))
  // @UseGuards(AuthGuard)
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
      productQueryDto.isSale,
      productQueryDto.isNewArrival,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @FormDataRequest()
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
