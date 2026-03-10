import { Module } from '@nestjs/common';
import { CustomTourRequestsService } from './custom-tour-requests.service';
import { CustomTourRequestsController } from './custom-tour-requests.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [CustomTourRequestsController],
    providers: [CustomTourRequestsService, PrismaService],
})
export class CustomTourRequestsModule { }
