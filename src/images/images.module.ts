import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagesRepository } from './repositories/images.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository, PrismaService],
})
export class ImagesModule {}
