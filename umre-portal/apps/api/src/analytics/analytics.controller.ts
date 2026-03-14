import {
    Controller, Post, Get, Delete, Body, Param, Req,
    UseGuards, HttpCode,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    // Public - izleme isteği (rate-limited)
    @Post('pageview')
    @HttpCode(200)
    @Throttle({ default: { ttl: 60000, limit: 30 } })
    async trackPageView(@Body() body: any, @Req() req: Request) {
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
            || req.socket?.remoteAddress
            || '';

        return this.analyticsService.trackPageView({
            path: body.path,
            referrer: body.referrer,
            userAgent: req.headers['user-agent'],
            duration: body.duration,
            sessionId: body.sessionId,
            ip,
        });
    }

    // JWT korumalı - istatistikler
    @Get('stats')
    @UseGuards(AuthGuard('jwt'))
    async getStats() {
        return this.analyticsService.getStats();
    }

    // IP Engelleme yönetimi (admin)
    @Get('blocked-ips')
    @UseGuards(AuthGuard('jwt'))
    async getBlockedIps() {
        return this.analyticsService.getBlockedIps();
    }

    @Post('block-ip')
    @UseGuards(AuthGuard('jwt'))
    async blockIp(@Body() body: { ip: string; reason?: string }) {
        return this.analyticsService.blockIp(body.ip, body.reason);
    }

    @Delete('block-ip/:ip')
    @UseGuards(AuthGuard('jwt'))
    async unblockIp(@Param('ip') ip: string) {
        return this.analyticsService.unblockIp(ip);
    }
}
