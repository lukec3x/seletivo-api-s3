import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  getImages(path: string) {
    console.log(path);
    return 'images';
  }
}
