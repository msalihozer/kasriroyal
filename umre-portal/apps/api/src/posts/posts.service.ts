import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const { category, q, page = 1 } = query;
        const take = 10;
        const skip = (page - 1) * take;

        const where: any = { status: 'published' };
        if (category) where.category = { slug: category };
        if (q) where.title = { contains: q, mode: 'insensitive' };

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                take,
                skip,
                include: { category: true },
                orderBy: { publishedAt: 'desc' },
            }),
            this.prisma.post.count({ where }),
        ]);

        return { data: posts, total, page: Number(page), lastPage: Math.ceil(total / take) };
    }

    async findOne(idOrSlug: string) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

        if (isUuid) {
            return this.prisma.post.findUnique({
                where: { id: idOrSlug },
                include: { category: true },
            });
        }

        return this.prisma.post.findUnique({
            where: { slug: idOrSlug },
            include: { category: true },
        });
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
