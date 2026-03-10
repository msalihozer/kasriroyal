import { Module } from '@nestjs/common';
import { TourTypesService } from './tour-types.service';
import { TourTypesController } from './tour-types.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [TourTypesController],
    providers: [TourTypesService, PrismaService],
    exports: [TourTypesService],
})
export class TourTypesModule { }
