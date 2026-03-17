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
                    await this.prisma.post.update({
                        where: { slug },
                        data: { viewCount: { increment: 1 } }
                    });
                } catch (e) {
                    // Slug might not exist or be invalid, ignore
                }
            }
        }

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
            // Bugün - tekil oturum sayısı (Ziyaretçi)
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${todayStart}
            `,
            // Bu hafta - tekil oturum
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${weekStart}
            `,
            // Bu ay - tekil oturum
            this.prisma.$queryRaw<{ count: bigint }[]>`
                SELECT COUNT(DISTINCT "sessionId") as count FROM "PageView"
                WHERE "createdAt" >= ${monthStart}
            `,
            // Top 5 sayfa (Tekil oturum bazlı popülerlik)
            this.prisma.$queryRaw<{ path: string; count: bigint }[]>`
                SELECT "path", COUNT(DISTINCT "sessionId") as count 
                FROM "PageView"
                WHERE "createdAt" >= ${monthStart}
                GROUP BY "path"
                ORDER BY count DESC
                LIMIT 5
            `,
            // Cihaz dağılımı (Tekil oturum bazlı)
            this.prisma.$queryRaw<{ device: string; count: bigint }[]>`
                SELECT "device", COUNT(DISTINCT "sessionId") as count
                FROM "PageView"
                WHERE "createdAt" >= ${monthStart} AND "device" IS NOT NULL
                GROUP BY "device"
            `,
            // Son 30 gün günlük TEKİL ziyaretçi serisi
            this.prisma.$queryRaw<{ date: string; count: bigint }[]>`
                SELECT DATE("createdAt") as date, COUNT(DISTINCT "sessionId") as count
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
            today:  Number((todayViews as { count: bigint }[])[0]?.count ?? 0),
            week:   Number((weekViews  as { count: bigint }[])[0]?.count ?? 0),
            month:  Number((monthViews as { count: bigint }[])[0]?.count ?? 0),
            topPages: topPages.map((p) => ({ path: p.path, count: Number(p.count) })),
            devices: deviceStats.map((d) => ({ device: d.device || 'unknown', count: Number(d.count) })),
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
