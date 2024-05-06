import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  async findProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return this.categoryService.findCategoryById(id);
  }

  @Get()
  async findAllCategory(): Promise<Category[]> {
    return this.categoryService.findAllCategory();
  }

  @Post()
  createProduct(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(body);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.categoryService.deleteCategory(id);
  }
}
