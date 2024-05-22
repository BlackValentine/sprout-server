import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    NestjsFormDataModule,
    UploadModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
