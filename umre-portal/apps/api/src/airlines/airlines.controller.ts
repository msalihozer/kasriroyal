import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Airlines')
@Controller('airlines')
export class AirlinesController {
    constructor(private readonly airlinesService: AirlinesService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.airlinesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.airlinesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createAirlineDto: any) {
        return this.airlinesService.create(createAirlineDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAirlineDto: any) {
        return this.airlinesService.update(id, updateAirlineDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.airlinesService.remove(id);
    }
}
