import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const { featured } = query;
        const where: any = { status: 'published' };
        if (featured) where.isFeatured = true;
        return this.prisma.vehicle.findMany({ where });
    }

    async findOne(id: string) {
        return this.prisma.vehicle.findUnique({ where: { id } });
    }

    async create(data: any) {
        return this.prisma.vehicle.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.vehicle.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.vehicle.delete({ where: { id } });
    }
}
