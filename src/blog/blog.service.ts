import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './blog.dto';
import { UploadService } from 'src/upload/upload.service';
import { PageMetaDto } from 'src/pagination/page-meta.dto';
import { PageDto } from 'src/pagination/page.dto';
import { PageOptionsDto } from 'src/pagination/page-options.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
    private uploadService: UploadService,
  ) {}

  async createBlog(blog: CreateBlogDto): Promise<Blog> {
    const imageName = await this.uploadService.upload(blog.thumbnail);
    const newBlog = this.blogRepo.create(blog);

    return this.blogRepo.save({
      ...newBlog,
      thumbnail: imageName,
    });
  }

  async getBlogById(blogId: number): Promise<Blog> {
    const blog = await this.blogRepo.findOne({ where: { id: blogId } });
    const thumbnailUrl = await this.uploadService.getLinkMediaKey(
      blog.thumbnail,
    );
    return {
      ...blog,
      thumbnail: thumbnailUrl,
    };
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Blog>> {
    const result = await this.blogRepo.find({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    for (const blog of result) {
      blog.thumbnail = await this.uploadService.getLinkMediaKey(blog.thumbnail);
    }

    const itemCount = await this.blogRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(result, pageMetaDto);
  }

  async increaseBlogView(id: number) {
    await this.blogRepo
      .createQueryBuilder()
      .update(Blog)
      .set({ views: () => `views + 1` })
      .where('id = :id', { id })
      .execute();
  }
}
