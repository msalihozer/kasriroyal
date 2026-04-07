import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findAll(query: any) {
        const cacheKey = `hotels_all_${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const { locationId, featured, status } = query;
        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        } else if (!status) {
            where.status = 'published';
        }

        if (locationId) where.locationId = locationId;
        if (featured) where.isFeatured = true;

        const hotels = await this.prisma.hotel.findMany({
            where,
            include: {
                location: true,
                features: true
            },
            orderBy: { createdAt: 'desc' }
        });

        await this.cacheManager.set(cacheKey, hotels);
        return hotels;
    }

    async findOne(slug: string) {
        const cacheKey = `hotel_slug_${slug}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const hotel = await this.prisma.hotel.findUnique({
            where: { slug },
            include: {
                location: true,
                features: true
            }
        });

        if (hotel) await this.cacheManager.set(cacheKey, hotel);
        return hotel;
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

        const hotel = await this.prisma.hotel.create({
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

        await this.clearHotelCache();
        return hotel;
    }

    async update(id: string, data: any) {
        const { features, locationId, ...rest } = data;

        const hotel = await this.prisma.hotel.update({
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

        await this.clearHotelCache();
        return hotel;
    }

    async remove(id: string) {
        const result = await this.prisma.hotel.delete({ where: { id } });
        await this.clearHotelCache();
        return result;
    }

    private async clearHotelCache() {
        const keys = await this.cacheManager.store.keys();
        const hotelKeys = keys.filter(key => key.startsWith('hotel'));
        await Promise.all(hotelKeys.map(key => this.cacheManager.del(key)));
    }
}
