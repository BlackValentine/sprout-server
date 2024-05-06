import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findCategoryById(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async findAllCategory(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existCategory) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async deleteCategory(id: number): Promise<string> {
    await this.categoryRepository.delete(id);
    return 'Delete product successfully';
  }
}
