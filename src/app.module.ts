import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductModule } from './products/product.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    }),
    ProductModule,
    CategoryModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
