import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { ImagesRepository } from './repositories/images.repository';
import axios from 'axios';

@Injectable()
export class ImagesService {
  private bucketBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly imagesRepository: ImagesRepository,
  ) {
    this.bucketBaseUrl = this.configService.get<string>('AWS_BUCKET_BASE_URL');
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async processImageFromS3(
    key: string,
    format: string,
    width: number,
    height: number,
    quality: number,
    grayscale: boolean,
  ): Promise<Buffer> {
    const uniqueId = `${key}-${format}-${width}-${height}-${quality}-${grayscale}`;

    const imageCache = await this.imagesRepository.findOne(uniqueId);
    if (imageCache) {
      return Buffer.from(imageCache.data, 'base64');
    }

    const url = `${this.bucketBaseUrl}/${key}`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    if (response.status !== 200) {
      throw new Error('Erro ao buscar a imagem do S3');
    }

    const imageBuffer = Buffer.from(response.data);

    let image = sharp(imageBuffer);

    if (width || height) {
      image = image.resize(width, height);
    }

    if (grayscale) {
      image = image.grayscale();
    }

    const validFormats = ['jpeg', 'png', 'webp'];
    if (format && validFormats.includes(format)) {
      image = image.toFormat(format as keyof sharp.FormatEnum, { quality });
    }

    const newImageBuffer = await image.toBuffer();

    await this.imagesRepository.create({
      uniqueId,
      data: newImageBuffer.toString('base64'),
    });

    return newImageBuffer;
  }
}
