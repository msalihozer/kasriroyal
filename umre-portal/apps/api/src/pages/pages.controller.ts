import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Get(':slug')
    findOne(@Param('slug') slug: string, @Query('status') status?: string) {
        // If status=all is passed, we treat it as an admin request
        const isAdmin = status === 'all';
        return this.pagesService.findOne(slug, isAdmin);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.pagesService.findAll(query);
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
