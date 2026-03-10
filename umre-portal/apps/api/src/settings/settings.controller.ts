import { Controller, Get, Put, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { SiteSettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('site-settings')
export class SiteSettingsController {
    constructor(private readonly settingsService: SiteSettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Get('debug')
    async debug() {
        const fs = require('fs');
        const path = require('path');
        const cwd = process.cwd();
        const uploadPath = path.join(cwd, 'apps/api/uploads');
        const exists = fs.existsSync(uploadPath);
        const files = exists ? fs.readdirSync(uploadPath) : [];
        return {
            cwd,
            uploadPath,
            exists,
            files: files.slice(0, 10), // List first 10 files
            settings: await this.settingsService.getSettings()
        };
    }

    @Get('logo')
    async getLogo(@Res() res: Response) {
        const settings = await this.settingsService.getSettings();
        if (settings?.logoUrl) {
            const url = settings.logoUrl.startsWith('http') ? settings.logoUrl : `http://localhost:4000${settings.logoUrl}`;
            return res.redirect(url);
        }
        return res.status(404).send('Not found');
    }

    @Get('favicon')
    async getFavicon(@Res() res: Response) {
        const settings = await this.settingsService.getSettings();
        if (settings?.faviconUrl) {
            const url = settings.faviconUrl.startsWith('http') ? settings.faviconUrl : `http://localhost:4000${settings.faviconUrl}`;
            return res.redirect(url);
        }
        return res.status(404).send('Not found');
    }

    @Get('footer-diyanet-image')
    async getFooterDiyanetImage(@Res() res: Response) {
        const settings = await this.settingsService.getSettings();
        if (settings?.footerDiyanetImageUrl) {
            const url = settings.footerDiyanetImageUrl.startsWith('http') ? settings.footerDiyanetImageUrl : `http://localhost:4000${settings.footerDiyanetImageUrl}`;
            return res.redirect(url);
        }
        return res.status(404).send('Not found');
    }

    @Get('footer-agency-image')
    async getFooterAgencyImage(@Res() res: Response) {
        const settings = await this.settingsService.getSettings();
        if (settings?.footerAgencyImageUrl) {
            const url = settings.footerAgencyImageUrl.startsWith('http') ? settings.footerAgencyImageUrl : `http://localhost:4000${settings.footerAgencyImageUrl}`;
            return res.redirect(url);
        }
        return res.status(404).send('Not found');
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateSettings(@Body() data: any) {
        return this.settingsService.updateSettings(data);
    }
}
