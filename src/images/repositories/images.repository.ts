import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageCacheDto } from '../dto/create-image-cache.dto';
import { ImagesCache } from '@prisma/client';

@Injectable()
export class ImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageCacheDto: CreateImageCacheDto): Promise<ImagesCache> {
    return this.prisma.imagesCache.create({
      data: createImageCacheDto,
    });
  }

  async findOne(uniqueId: string): Promise<ImagesCache> {
    return this.prisma.imagesCache.findUnique({
      where: {
        uniqueId,
      },
    });
  }
}
