import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomTourRequestsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.customTourRequest.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.customTourRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.customTourRequest.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.customTourRequest.update({
            where: { id },
            data,
        });
    }
    async remove(id: string) {
        return this.prisma.customTourRequest.delete({
            where: { id },
        });
    }
}
