import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadModule } from 'src/upload/upload.module';
import { CheckProductExist } from 'src/middlewares/checkProductExist.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UserModule,
    NestjsFormDataModule,
    UploadModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService, ConfigService],
  exports: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckProductExist).forRoutes('product/:productId');
  }
}
