import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: any) {
        const { category, date, days, q, page = 1, featured, minPrice, maxPrice, type } = query;
        const take = 10;
        const skip = (page - 1) * take;

        const where: any = { status: 'published' };
        if (featured) where.isFeatured = true;
        if (category) where.category = { slug: category };
        if (type) where.tourType = { slug: type };
        if (days) where.durationDays = Number(days);
        // Date and Price filtering logic...
        if (q) where.title = { contains: q, mode: 'insensitive' };

        // Admin can see all if no specific filter (or add admin specific logic if needed)

        const [tours, total] = await Promise.all([
            this.prisma.tour.findMany({
                where,
                take,
                skip,
                include: {
                    category: true,
                    tourType: true,
                    vehicle: true,
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

        return { data: tours, total, page: Number(page), lastPage: Math.ceil(total / take) };
    }

    async findOne(term: string) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(term);

        return this.prisma.tour.findUnique({
            where: isUUID ? { id: term } : { slug: term },
            include: {
                category: true,
                tourType: true,
                vehicle: true,
                itinerary: {
                    include: {
                        location: true,
                        hotel: true
                    },
                    orderBy: { day: 'asc' }
                }
            },
        });
    }

    // Admin methods
    async create(data: any) {
        // Handle relations manually if needed, or rely on frontend sending correct structure
        // assuming payload has: { title, ..., itinerary: [{ day, title, locationId, hotelId }] }
        const { itinerary, vehicleId, categoryId, tourTypeId, ...rest } = data;

        return this.prisma.tour.create({
            data: {
                ...rest,
                vehicleId: vehicleId || null,
                categoryId: categoryId || null,
                tourTypeId: tourTypeId || null,
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
    }

    async update(id: string, data: any) {
        const { itinerary, vehicleId, categoryId, tourTypeId, ...rest } = data;

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

        return this.prisma.tour.update({
            where: { id },
            data: updateData,
            include: {
                itinerary: true
            }
        });
    }

    async remove(id: string) {
        return this.prisma.tour.delete({ where: { id } });
    }
}
