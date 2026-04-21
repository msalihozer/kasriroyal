import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirlinesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        return this.prisma.airline.findMany({
            orderBy: { name: 'asc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.airline.findUnique({ where: { id } });
    }

    async create(data: any) {
        return this.prisma.airline.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.airline.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.airline.delete({ where: { id } });
    }
}
