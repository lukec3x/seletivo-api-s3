import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
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
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error('Erro ao buscar a imagem do S3');
    }

    const imageBuffer = await this.streamToBuffer(response.Body as Readable);

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

    return await image.toBuffer();
  }
}
