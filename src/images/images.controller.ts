import { Controller, Get, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Request } from 'express';

@Controller('')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('*')
  getImages(@Req() request: Request) {
    const path = request.path;
    return this.imagesService.getImages(path);
  }
}
