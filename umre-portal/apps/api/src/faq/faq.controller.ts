import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Get()
    findAll() {
        return this.faqService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.faqService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createDto: any) {
        return this.faqService.create(createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.faqService.update(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.faqService.remove(id);
    }
}
