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

        // Prevent duplicate hits for same session + path within 15 minutes
        if (data.sessionId && !data.duration) { // Duration check means it's an update, don't deduplicate updates
            const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
            const recentView = await this.prisma.pageView.findFirst({
                where: {
                    sessionId: data.sessionId,
                    path: data.path,
                    createdAt: { gte: fifteenMinsAgo }
                }
            });
            if (recentView) return { ok: true, duplicated: true };
        }

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

        // Increment Blog Post View Count if applicable
        if (data.path.startsWith('/blog/') && !data.duration) {
            const slug = data.path.replace('/blog/', '').split('?')[0];
            if (slug && slug !== '') {
                try {
                    await this.prisma.$executeRaw`UPDATE "Post" SET "viewCount" = "viewCount" + 1 WHERE "slug" = ${slug}`;
                } catch (e) {
                    // Slug might not exist or be invalid, ignore
                }
            }
        }

        return { ok: true };
    }

    async getStats(range: string = '1m') {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const startDate = new Date(now);
        let groupByHour = false;

        switch (range) {
            case '24h':
                startDate.setHours(now.getHours() - 24);
                groupByHour = true;
                break;
            case '1w':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1m':
                startDate.setDate(now.getDate() - 30);
                break;
            case '3m':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6m':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        const [
            todayViews,
            weekViews,
            monthViews,
            topPages,
            deviceStats,
            dailySeries,
            avgDuration,
        ] = await Promise.all([
            // Bugün - tekil oturum sayısı (Ziyaretçi)
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${todayStart}
            `,
            // Bu hafta - tekil oturum
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)}
            `,
            // Bu ay - tekil oturum
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
            `,
            // Top 5 sayfa (Seçili aralığa göre)
            this.prisma.$queryRaw<{ path: string; count: bigint }[]>`
                SELECT "path", COUNT(DISTINCT "sessionId") as count 
                FROM "PageView"
                WHERE "createdAt" >= ${startDate}
                GROUP BY "path"
                ORDER BY count DESC
                LIMIT 5
            `,
            // Cihaz dağılımı (Seçili aralığa göre)
            this.prisma.$queryRaw<{ device: string; count: bigint }[]>`
                SELECT "device", COUNT(DISTINCT "sessionId") as count
                FROM "PageView"
                WHERE "createdAt" >= ${startDate} AND "device" IS NOT NULL
                GROUP BY "device"
            `,
            // Günlük/Saatlik TEKİL ziyaretçi serisi
            groupByHour 
                ? this.prisma.$queryRaw<{ date: string; count: bigint }[]>`
                    SELECT TO_CHAR("createdAt", 'YYYY-MM-DD HH24:00') as date, COUNT(DISTINCT "sessionId") as count
                    FROM "PageView"
                    WHERE "createdAt" >= ${startDate}
                    GROUP BY date
                    ORDER BY date ASC
                `
                : this.prisma.$queryRaw<{ date: string; count: bigint }[]>`
                    SELECT DATE("createdAt") as date, COUNT(DISTINCT "sessionId") as count
                    FROM "PageView"
                    WHERE "createdAt" >= ${startDate}
                    GROUP BY DATE("createdAt")
                    ORDER BY date ASC
                `,
            // Ortalama kalma süresi (Seçili aralığa göre)
            this.prisma.pageView.aggregate({
                _avg: { duration: true },
                where: { createdAt: { gte: startDate }, duration: { not: null } },
            }),
        ]);

        return {
            today:  Number((todayViews as { count: bigint }[])[0]?.count ?? 0),
            week:   Number((weekViews  as { count: bigint }[])[0]?.count ?? 0),
            month:  Number((monthViews as { count: bigint }[])[0]?.count ?? 0),
            topPages: topPages.map((p) => ({ path: p.path, count: Number(p.count) })),
            devices: deviceStats.map((d) => ({ device: d.device || 'unknown', count: Number(d.count) })),
            dailySeries: dailySeries.map((d) => ({
                date: d.date,
                count: Number(d.count),
            })),
            avgDuration: Math.round((avgDuration._avg.duration || 0) / 1000), // Convert ms to s
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
