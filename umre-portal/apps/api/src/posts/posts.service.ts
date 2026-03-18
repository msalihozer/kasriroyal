import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const { category, q, page = 1, status, sort = 'desc' } = query;
        const take = 10;
        const skip = (page - 1) * take;
        const orderDir = sort === 'asc' ? 'asc' : 'desc';

        const where: any = {};
        
        // Admin can request status=all to see everything
        if (status === 'all') {
            // No strict filter for Admin
        } else {
            // Public filter
            where.status = 'published';
            where.publishedAt = { lte: new Date() };
        }

        if (category) where.category = { slug: category };
        if (q) where.title = { contains: q, mode: 'insensitive' };

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                take,
                skip,
                include: { category: true },
                orderBy: { publishedAt: orderDir },
            }),
            this.prisma.post.count({ where }),
        ]);

        return { data: posts, total, page: Number(page), lastPage: Math.ceil(total / take) };
    }

    async findOne(idOrSlug: string, isAdmin = false) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const where: any = isUuid ? { id: idOrSlug } : { slug: idOrSlug };

        const post = await this.prisma.post.findUnique({
            where,
            include: { category: true },
        });

        if (!post) return null;

        // If not admin, check if published and not scheduled for future
        if (!isAdmin) {
            if (post.status !== 'published') return null;
            if (post.publishedAt && post.publishedAt > new Date()) return null;
        }

        return post;
    }

    async create(data: any) {
        return this.prisma.post.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.post.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.post.delete({ where: { id } });
    }
}
