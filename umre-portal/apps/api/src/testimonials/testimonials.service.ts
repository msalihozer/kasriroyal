import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        return this.prisma.testimonial.findUnique({ where: { id } });
    }

    async create(data: any) {
        return this.prisma.testimonial.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.testimonial.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.testimonial.delete({ where: { id } });
    }
}
