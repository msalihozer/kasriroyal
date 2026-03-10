import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.pagesService.findOne(slug);
    }

    @Get()
    findAll() {
        return this.pagesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createPageDto: any) {
        return this.pagesService.create(createPageDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePageDto: any) {
        return this.pagesService.update(id, updatePageDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagesService.remove(id);
    }
}
