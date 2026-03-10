import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.hotelsService.findAll(query);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.hotelsService.findOne(slug);
    }

    @Get('by-id/:id')
    findById(@Param('id') id: string) {
        return this.hotelsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createHotelDto: any) {
        return this.hotelsService.create(createHotelDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHotelDto: any) {
        return this.hotelsService.update(id, updateHotelDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hotelsService.remove(id);
    }
}
