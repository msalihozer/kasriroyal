import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TourTypesModule } from './tour-types/tour-types.module';

@Module({
    imports: [TourTypesModule],
    controllers: [ToursController],
    providers: [ToursService, PrismaService],
})
export class ToursModule { }
