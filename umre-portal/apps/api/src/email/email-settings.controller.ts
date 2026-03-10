
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
        const { host, port, user, pass, fromEmail, notificationEmail } = body;
        const existing = await this.prisma.emailSettings.findFirst();
        if (existing) {
            return this.prisma.emailSettings.update({
                where: { id: existing.id },
                data: { host, port: parseInt(port), user, pass, fromEmail, notificationEmail },
            });
        } else {
            return this.prisma.emailSettings.create({
                data: { host, port: parseInt(port), user, pass, fromEmail, notificationEmail },
            });
        }
    }
}
