import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) {}

    private hashIp(ip: string): string {
        return crypto.createHash('sha256').update(ip + 'salt_kasri').digest('hex').substring(0, 16);
    }

    private detectDevice(userAgent: string): string {
        if (!userAgent) return 'unknown';
        const ua = userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
            if (/ipad|tablet/.test(ua)) return 'tablet';
            return 'mobile';
        }
        return 'desktop';
    }

    async trackPageView(data: {
        path: string;
        referrer?: string;
        userAgent?: string;
        duration?: number;
        sessionId?: string;
        ip?: string;
    }) {
        const device = data.userAgent ? this.detectDevice(data.userAgent) : undefined;
        const hashedIp = data.ip ? this.hashIp(data.ip) : undefined;

        await this.prisma.pageView.create({
            data: {
                path: data.path,
                referrer: data.referrer,
                device,
                duration: data.duration,
                sessionId: data.sessionId,
                ip: hashedIp,
            },
        });
        return { ok: true };
    }

    async getStats() {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);

        const monthStart = new Date(now);
        monthStart.setDate(now.getDate() - 30);

        const [
            todayViews,
            weekViews,
            monthViews,
            topPages,
            deviceStats,
            dailySeries,
            avgDuration,
        ] = await Promise.all([
            // Bugün
            this.prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
            // Bu hafta
            this.prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
            // Bu ay
            this.prisma.pageView.count({ where: { createdAt: { gte: monthStart } } }),
            // Top 5 sayfa
            this.prisma.pageView.groupBy({
                by: ['path'],
                _count: { path: true },
                orderBy: { _count: { path: 'desc' } },
                take: 5,
                where: { createdAt: { gte: monthStart } },
            }),
            // Cihaz dağılımı
            this.prisma.pageView.groupBy({
                by: ['device'],
                _count: { device: true },
                where: { createdAt: { gte: monthStart } },
            }),
            // Son 30 gün günlük seri (raw query)
            this.prisma.$queryRaw<{ date: string; count: bigint }[]>`
                SELECT DATE("createdAt") as date, COUNT(*) as count
                FROM "PageView"
                WHERE "createdAt" >= ${monthStart}
                GROUP BY DATE("createdAt")
                ORDER BY date ASC
            `,
            // Ortalama kalma süresi
            this.prisma.pageView.aggregate({
                _avg: { duration: true },
                where: { createdAt: { gte: monthStart }, duration: { not: null } },
            }),
        ]);

        return {
            today: todayViews,
            week: weekViews,
            month: monthViews,
            topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
            devices: deviceStats.map((d) => ({ device: d.device || 'unknown', count: d._count.device })),
            dailySeries: dailySeries.map((d) => ({
                date: d.date,
                count: Number(d.count),
            })),
            avgDuration: Math.round(avgDuration._avg.duration || 0),
        };
    }

    async getBlockedIps() {
        return this.prisma.blockedIp.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async blockIp(ip: string, reason?: string) {
        return this.prisma.blockedIp.upsert({
            where: { ip },
            update: { reason },
            create: { ip, reason },
        });
    }

    async unblockIp(ip: string) {
        return this.prisma.blockedIp.delete({ where: { ip } });
    }

    async isBlocked(ip: string): Promise<boolean> {
        const blocked = await this.prisma.blockedIp.findUnique({ where: { ip } });
        return !!blocked;
    }
}
