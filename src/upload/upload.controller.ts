import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image-blog')
  @FormDataRequest()
  async uploadAndGetLink(@Body() body: any): Promise<string> {
    return await this.uploadService.uploadAndGetLink(body.image);
  }

  @Post()
  @FormDataRequest()
  async upload(@Body() body: any): Promise<string> {
    return await this.uploadService.upload(body.image);
  }

  @Get(':file')
  async getImageLink(@Param('file') file: string): Promise<string> {
    return await this.uploadService.getLinkMediaKey(file);
  }

  @Delete(':file')
  async deleteImage(@Param('file') file: string): Promise<string> {
    return await this.uploadService.deleteFileS3(file);
  }
}
