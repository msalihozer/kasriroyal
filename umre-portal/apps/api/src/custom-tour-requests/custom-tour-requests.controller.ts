import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { CustomTourRequestsService } from './custom-tour-requests.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('CustomTourRequests')
@Controller('custom-tour-requests')
export class CustomTourRequestsController {
    constructor(private readonly service: CustomTourRequestsService) { }

    @Post()
    async create(@Body() createDto: any) {
        try {
            console.log('Received Custom Tour Request:', createDto);

            // Manual type conversion to ensure numbers are numbers and dates are Dates
            // Manual type conversion and sanitization
            const {
                fullName, phone, email, personCount,
                mekkeDays, medineDays, startDate,
                airline, flightClass, departureCity,
                guideRequested, message,
                mekkeHotel, medineHotel, vehicle
            } = createDto;

            const processedData = {
                fullName,
                phone,
                email,
                personCount: Number(personCount) || 1,
                mekkeDays: mekkeDays ? Number(mekkeDays) : undefined,
                medineDays: medineDays ? Number(medineDays) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                airline,
                flightClass,
                departureCity,
                guideRequested: Boolean(guideRequested),
                message,

                // Mapped fields
                hotelChoiceType: 'specific',
                hotelSelection: {
                    mekke: mekkeHotel,
                    medine: medineHotel
                },
                transferChoiceType: 'specific',
                vehicleSelection: vehicle,

                // Explicitly set status if needed, or let default
                status: 'pending'
            };

            return await this.service.create(processedData);
        } catch (error) {
            console.error('Error creating custom tour request:', error);
            throw error; // Let NestJS handle the 500, but now we have logs
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.service.update(id, updateDto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
