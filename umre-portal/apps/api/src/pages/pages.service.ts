import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
    constructor(private prisma: PrismaService) { }

    async findOne(idOrSlug: string) {
        return this.prisma.page.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug }
                ]
            }
        });
    }

    async findAll() {
        return this.prisma.page.findMany();
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
