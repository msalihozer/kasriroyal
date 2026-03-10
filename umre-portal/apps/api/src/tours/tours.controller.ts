import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.toursService.findAll(query);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.toursService.findOne(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createTourDto: any) {
        return this.toursService.create(createTourDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTourDto: any) {
        return this.toursService.update(id, updateTourDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.toursService.remove(id);
    }
}
