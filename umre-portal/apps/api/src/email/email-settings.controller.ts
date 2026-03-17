
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('settings/email')
export class EmailSettingsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getSettings() {
        const settings = await this.prisma.emailSettings.findFirst();
        return settings || {};
    }

    @Put()
    @UseGuards(AuthGuard('jwt'))
    async updateSettings(@Body() body: any) {
        const { 
            host, 
            port, 
            user, 
            pass, 
            fromEmail, 
            notificationEmail, 
            whatsappEnabled, 
            whatsappInstanceId, 
            whatsappToken, 
            whatsappPhone 
        } = body;

        const data: any = {
            host,
            port: parseInt(port.toString()) || 587,
            user,
            pass,
            fromEmail,
            notificationEmail,
            whatsappEnabled: Boolean(whatsappEnabled),
            whatsappInstanceId: whatsappInstanceId || null,
            whatsappToken: whatsappToken || null,
            whatsappPhone: whatsappPhone || null,
        };

        const existing = await this.prisma.emailSettings.findFirst();
        if (existing) {
            return this.prisma.emailSettings.update({
                where: { id: existing.id },
                data,
            });
        } else {
            return this.prisma.emailSettings.create({
                data,
            });
        }
    }
}
