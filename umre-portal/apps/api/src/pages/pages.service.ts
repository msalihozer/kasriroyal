import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
    constructor(private prisma: PrismaService) { }

    async findOne(idOrSlug: string, isAdmin = false) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const where: any = isUuid ? { id: idOrSlug } : { slug: idOrSlug };

        const page = await this.prisma.page.findUnique({
            where,
        });

        if (!page) return null;

        // If not admin, check if published and not scheduled for future
        if (!isAdmin) {
            if (page.status !== 'published') return null;
            if (page.publishedAt && page.publishedAt > new Date()) return null;
        }

        return page;
    }

    async findAll(query?: any) {
        const { status } = query || {};
        const where: any = {};

        if (status !== 'all') {
            where.status = 'published';
            where.publishedAt = { lte: new Date() };
        }

        return this.prisma.page.findMany({
            where,
            orderBy: { publishedAt: 'desc' }
        });
    }

    async create(data: any) {
        return this.prisma.page.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.page.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.page.delete({ where: { id } });
    }

    // Menu methods can also be here or in separate module
    async getMenu() {
        return this.prisma.menuItem.findMany({ orderBy: { orderIndex: 'asc' }, include: { children: true } });
    }
}
