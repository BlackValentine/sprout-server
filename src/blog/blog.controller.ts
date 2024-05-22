import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateBlogDto } from './blog.dto';
import { Blog } from './blog.entity';
import { BlogService } from './blog.service';
import { PageDto } from 'src/pagination/page.dto';
import { PageOptionsDto } from 'src/pagination/page-options.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @FormDataRequest()
  @Post()
  async createBlog(@Body() blog: CreateBlogDto): Promise<Blog> {
    return await this.blogService.createBlog(blog);
  }

  @Get(':id')
  async getBlogById(@Param('id', ParseIntPipe) id: number): Promise<Blog> {
    await this.blogService.increaseBlogView(id);
    return this.blogService.getBlogById(id);
  }

  @Get()
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Blog>> {
    return this.blogService.findAll({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      page: pageOptionsDto.page,
    });
  }
}
