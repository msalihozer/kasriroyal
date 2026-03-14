import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {
    private cache = new Map<string, { blocked: boolean; expiresAt: number }>();
    private readonly CACHE_TTL = 60_000; // 1 dakika cache

    constructor(private prisma: PrismaService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
            || req.socket?.remoteAddress
            || '';

        if (!ip) return next();

        const now = Date.now();
        const cached = this.cache.get(ip);

        // Cache geçerliyse veritabanına gitme
        if (cached && cached.expiresAt > now) {
            if (cached.blocked) throw new ForbiddenException('IP engellenmiştir.');
            return next();
        }

        // Veritabanını kontrol et
        const blocked = await this.prisma.blockedIp.findUnique({ where: { ip } });
        this.cache.set(ip, { blocked: !!blocked, expiresAt: now + this.CACHE_TTL });

        if (blocked) throw new ForbiddenException('IP engellenmiştir.');
        next();
    }
}
