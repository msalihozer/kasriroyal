import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteSettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        const settings = await this.prisma.siteSettings.findFirst();
        if (!settings) {
            return this.prisma.siteSettings.create({
                data: {}
            });
        }
        return settings;
    }

    async updateSettings(data: any) {
        const settings = await this.prisma.siteSettings.findFirst();
        if (settings) {
            return this.prisma.siteSettings.update({ where: { id: settings.id }, data });
        }
        return this.prisma.siteSettings.create({ data });
    }
}
