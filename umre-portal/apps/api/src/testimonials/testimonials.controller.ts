import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Get()
    findAll() {
        return this.testimonialsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testimonialsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createDto: any) {
        return this.testimonialsService.create(createDto);
    }

    @Post('public')
    createPublic(@Body() createDto: any) {
        return this.testimonialsService.create(createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.testimonialsService.update(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.testimonialsService.remove(id);
    }
}
