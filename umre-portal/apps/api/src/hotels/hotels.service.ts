import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const { locationId, featured, status } = query;
        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        } else if (!status) {
            where.status = 'published';
        }

        if (locationId) where.locationId = locationId;
        if (featured) where.isFeatured = true;

        return this.prisma.hotel.findMany({
            where,
            include: {
                location: true,
                features: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(slug: string) {
        return this.prisma.hotel.findUnique({
            where: { slug },
            include: {
                location: true,
                features: true
            }
        });
    }

    async findById(id: string) {
        return this.prisma.hotel.findUnique({
            where: { id },
            include: {
                location: true,
                features: true
            }
        });
    }

    async create(data: any) {
        const { features, locationId, ...rest } = data;

        return this.prisma.hotel.create({
            data: {
                ...rest,
                location: locationId ? { connect: { id: locationId } } : undefined,
                features: features && features.length > 0
                    ? { connect: features.map((id: string) => ({ id })) }
                    : undefined
            },
            include: {
                location: true,
                features: true
            }
        });
    }

    async update(id: string, data: any) {
        const { features, locationId, ...rest } = data;

        return this.prisma.hotel.update({
            where: { id },
            data: {
                ...rest,
                location: locationId ? { connect: { id: locationId } } : undefined,
                features: features
                    ? { set: features.map((id: string) => ({ id })) }
                    : undefined
            },
            include: {
                location: true,
                features: true
            }
        });
    }

    async remove(id: string) {
        return this.prisma.hotel.delete({ where: { id } });
    }
}
