import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.faqItem.findMany({
            orderBy: { orderIndex: 'asc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.faqItem.findUnique({ where: { id } });
    }

    async create(data: any) {
        return this.prisma.faqItem.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.faqItem.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.faqItem.delete({ where: { id } });
    }
}
