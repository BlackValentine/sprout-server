import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PageOptionsDto } from 'src/pagination/page-options.dto';
import { PageDto } from 'src/pagination/page.dto';
import { PageMetaDto } from 'src/pagination/page-meta.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async findProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
    });
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    categoryId: number,
  ): Promise<PageDto<Product>> {
    let result: Product[];
    let itemCount: number;
    if (categoryId) {
      result = await this.productRepository.find({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where: {
          categoryId,
        },
      });
      itemCount = await this.productRepository.count({
        where: { categoryId },
      });
    } else {
      result = await this.productRepository.find({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      });
      itemCount = await this.productRepository.count();
    }
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(result, pageMetaDto);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.productRepository.findOneOrFail({
      where: { id },
    });
  }

  async deleteProduct(id: number): Promise<string> {
    await this.productRepository.delete(id);
    return 'Delete product successfully';
  }

  async increaseProductView(id: number) {
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ views: () => `views + 1` })
      .where('id = :id', { id })
      .execute();
  }
}
