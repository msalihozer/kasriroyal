import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TourTypesService } from './tour-types.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tour Types')
@Controller('tour-types')
export class TourTypesController {
    constructor(private readonly tourTypesService: TourTypesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTourTypeDto: any) {
        return this.tourTypesService.create(createTourTypeDto);
    }

    @Get()
    findAll() {
        return this.tourTypesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tourTypesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateTourTypeDto: any) {
        return this.tourTypesService.update(id, updateTourTypeDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.tourTypesService.remove(id);
    }
}
