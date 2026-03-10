
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    create(@Body() createReservationDto: any) {
        return this.reservationsService.create(createReservationDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
        return this.reservationsService.findAll();
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.reservationsService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.reservationsService.remove(id);
    }
}
