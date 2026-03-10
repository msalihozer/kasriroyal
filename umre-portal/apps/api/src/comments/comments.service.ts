
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.comment.create({
            data: {
                name: data.name,
                content: data.content,
                rating: data.rating,
                type: data.type,
                entityId: data.entityId,
                entityName: data.entityName,
                isPublished: false,
            },
        });
    }

    // Public: Get published comments
    async findAllPublished(type: string, entityId: string) {
        return this.prisma.comment.findMany({
            where: {
                type,
                entityId,
                isPublished: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Admin: Get all
    async findAll() {
        return this.prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, isPublished: boolean) {
        return this.prisma.comment.update({
            where: { id },
            data: { isPublished },
        });
    }

    async remove(id: string) {
        return this.prisma.comment.delete({
            where: { id },
        });
    }
}
