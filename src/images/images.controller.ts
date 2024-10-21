import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ImagesService } from './images.service';

@Controller('')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('*')
  async getImages(
    @Req() request: Request,
    @Res() response: Response,
    @Query('fm') format: string,
    @Query('w') width: string,
    @Query('h') height: string,
    @Query('q') quality: string,
    @Query('gray') gray: string,
  ) {
    const key: string = request.path.replace(/^\//, '');

    if (!key) {
      response.status(404).send('Não encontrado');
      return;
    }

    const imageBuffer = await this.imagesService.processImageFromS3(
      key,
      format || 'jpeg',
      parseInt(width, 10) || null,
      parseInt(height, 10) || null,
      parseInt(quality, 10) || 85,
      gray === '1',
    );

    response.setHeader('Content-Type', `image/${format || 'jpeg'}`);
    response.send(imageBuffer);
  }
}
