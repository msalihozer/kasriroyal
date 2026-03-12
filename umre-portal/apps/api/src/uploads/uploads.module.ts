import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
        PrismaModule
    ],
    controllers: [UploadsController],
    providers: [UploadsService],
    exports: [UploadsService]
})
export class UploadsModule { }
