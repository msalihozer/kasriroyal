import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findAll(query: any) {
        const cacheKey = `tours_all_${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey) as any;
        if (cached) return cached;

        const { category, date, days, q, page = 1, featured, minPrice, maxPrice, type } = query;
        const take = 10;
        const skip = (page - 1) * take;

        const where: any = { status: 'published' };
        if (featured) where.isFeatured = true;
        
        // Fix relation filtering: use is: { slug: ... } instead of direct assignment
        if (category) where.category = { is: { slug: category } };
        if (type) where.tourType = { is: { slug: type } };
        
        if (days) where.durationDays = Number(days);
        // Date and Price filtering logic...
        if (q) where.title = { contains: q, mode: 'insensitive' };

        const [tours, total] = await Promise.all([
            this.prisma.tour.findMany({
                where,
                take,
                skip,
                include: {
                    category: true,
                    tourType: true,
                    vehicle: true,
                    airlines: true,
                    itinerary: {
                        include: {
                            hotel: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.tour.count({ where }),
        ]);

        const result = { data: tours, total, page: Number(page), lastPage: Math.ceil(total / take) };
        await this.cacheManager.set(cacheKey, result);
        return result;
    }

    async findOne(term: string) {
        const cacheKey = `tour_slug_${term}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) return cached;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(term);

        const tour = await this.prisma.tour.findUnique({
            where: isUUID ? { id: term } : { slug: term },
            include: {
                category: true,
                tourType: true,
                vehicle: true,
                airlines: true,
                itinerary: {
                    include: {
                        location: true,
                        hotel: true
                    },
                    orderBy: { day: 'asc' }
                }
            },
        });

        if (tour) await this.cacheManager.set(cacheKey, tour);
        return tour;
    }

    // Admin methods
    async create(data: any) {
        const { itinerary, vehicleId, categoryId, tourTypeId, airlineIds, vehicle, category, tourType, airlines, ...rest } = data;

        const tour = await this.prisma.tour.create({
            data: {
                ...rest,
                vehicleId: vehicleId || null,
                categoryId: categoryId || null,
                tourTypeId: tourTypeId || null,
                airlines: airlineIds ? {
                    connect: airlineIds.map((id: string) => ({ id }))
                } : undefined,
                itinerary: itinerary ? {
                    create: itinerary.map((item: any) => ({
                        day: item.day,
                        title: item.title,
                        description: item.description,
                        locationId: item.locationId || null,
                        hotelId: item.hotelId || null
                    }))
                } : undefined
            },
            include: {
                itinerary: true
            }
        });

        await this.clearTourCache();
        return tour;
    }

    async update(id: string, data: any) {
        const { itinerary, vehicleId, categoryId, tourTypeId, airlineIds, vehicle, category, tourType, airlines, ...rest } = data;

        // If itinerary is provided, we might want to delete existing and recreate, or update incrementally.
        if (itinerary) {
            await this.prisma.tourItinerary.deleteMany({ where: { tourId: id } });
        }

        const updateData: any = { ...rest };

        // Only explicitly set to null if empty string is passed (clearing standard dropdown).
        // If undefined, it means the frontend didn't include it in a partial PATCH payload, so don't touch it.
        if (vehicleId !== undefined) updateData.vehicleId = vehicleId || null;
        if (categoryId !== undefined) updateData.categoryId = categoryId || null;
        if (tourTypeId !== undefined) updateData.tourTypeId = tourTypeId || null;

        if (airlineIds !== undefined) {
            updateData.airlines = {
                set: airlineIds.map((id: string) => ({ id }))
            };
        }

        if (itinerary) {
            updateData.itinerary = {
                create: itinerary.map((item: any) => ({
                    day: item.day,
                    title: item.title,
                    description: item.description,
                    locationId: item.locationId || null,
                    hotelId: item.hotelId || null
                }))
            };
        }

        const tour = await this.prisma.tour.update({
            where: { id },
            data: updateData,
            include: {
                itinerary: true
            }
        });

        await this.clearTourCache();
        return tour;
    }

    async remove(id: string) {
        const result = await this.prisma.tour.delete({ where: { id } });
        await this.clearTourCache();
        return result;
    }

    private async clearTourCache() {
        const keys = await this.cacheManager.store.keys();
        const tourKeys = keys.filter(key => key.startsWith('tour'));
        await Promise.all(tourKeys.map(key => this.cacheManager.del(key)));
    }
}
