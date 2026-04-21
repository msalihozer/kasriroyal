import { Controller, Post, Get, Delete, Param, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join, extname } from 'path';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Get()
    findAll(@Query('page') page: string = '1') {
        const pageNum = parseInt(page, 10);
        return this.uploadsService.findAll(isNaN(pageNum) ? 1 : pageNum);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.uploadsService.remove(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(process.cwd(), 'uploads'),
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    async uploadFile(@UploadedFile() file: any) {
        const url = `/uploads/${file.filename}`;
        
        // Save to DB
        await this.uploadsService.create({
            url,
            type: file.mimetype.startsWith('image/') ? 'image' : 'file',
            filename: file.originalname
        });

        return {
            url: url,
            filename: file.filename,
        };
    }
}
