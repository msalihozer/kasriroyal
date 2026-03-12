import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { url: string; type: string; filename: string }) {
        return this.prisma.media.create({
            data: {
                url: data.url,
                type: data.type,
                altText: data.filename // Default alt text
            }
        });
    }

    async findAll(page: number = 1) {
        const safePage = Math.max(1, Math.floor(page));
        const take = 20;
        const skip = (safePage - 1) * take;

        const [media, total] = await Promise.all([
            this.prisma.media.findMany({
                take,
                skip,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.media.count()
        ]);

        return {
            data: media,
            total,
            page,
            lastPage: Math.ceil(total / take)
        };
    }

    async remove(id: string) {
        return this.prisma.media.delete({ where: { id } });
    }
}
