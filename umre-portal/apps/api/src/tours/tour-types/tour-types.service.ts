import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TourTypesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.tourType.create({ data });
    }

    async findAll() {
        return this.prisma.tourType.findMany();
    }

    async findOne(id: string) {
        return this.prisma.tourType.findUnique({ where: { id } });
    }

    async update(id: string, data: any) {
        return this.prisma.tourType.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.tourType.delete({ where: { id } });
    }
}
