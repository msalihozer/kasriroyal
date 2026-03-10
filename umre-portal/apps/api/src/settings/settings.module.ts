import { Module } from '@nestjs/common';
import { SiteSettingsService } from './settings.service';
import { SiteSettingsController } from './settings.controller';

@Module({
    controllers: [SiteSettingsController],
    providers: [SiteSettingsService],
})
export class SiteSettingsModule { }
