import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { PageOptionsDto } from 'src/pagination/page-options.dto';
import { PageDto } from 'src/pagination/page.dto';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly uploadService: UploadService,
  ) {}

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    let image: string;
    let hoverImage: string;
    if (product?.image) {
      image = await this.uploadService.getLinkMediaKey(product.image);
    }
    if (product?.hoverImage) {
      hoverImage = await this.uploadService.getLinkMediaKey(product.hoverImage);
    }
    return {
      ...product,
      image,
      hoverImage,
    };
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    categoryId: number,
    isSale: boolean,
    isNewArrival: boolean,
  ): Promise<PageDto<Product>> {
    let result: Product[];
    let itemCount: number;
    if (categoryId) {
      result = await this.productRepository.find({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where: {
          categoryId,
          isSale,
          isNewArrival,
        },
      });
      for (const product of result) {
        product.image = await this.uploadService.getLinkMediaKey(product.image);
        product.hoverImage = await this.uploadService.getLinkMediaKey(
          product.hoverImage,
        );
      }
      itemCount = await this.productRepository.count({
        where: { categoryId, isSale, isNewArrival },
      });
    } else {
      result = await this.productRepository.find({
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        where: {
          isSale,
          isNewArrival,
        },
      });
      for (const product of result) {
        product.image = await this.uploadService.getLinkMediaKey(product.image);
        product.hoverImage = await this.uploadService.getLinkMediaKey(
          product.hoverImage,
        );
      }
      itemCount = await this.productRepository.count({
        where: {
          isSale,
          isNewArrival,
        },
      });
    }
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(result, pageMetaDto);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const image = await this.uploadService.upload(createProductDto.image);
    const hoverImage = await this.uploadService.upload(
      createProductDto.hoverImage,
    );
    const product = {
      ...createProductDto,
      image: image,
      hoverImage: hoverImage,
    };
    const newProduct = this.productRepository.create(product);
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
