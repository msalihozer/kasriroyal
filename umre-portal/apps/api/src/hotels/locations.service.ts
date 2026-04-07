import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(data: any) {
    const result = await this.prisma.location.create({ data });
    await this.clearCache();
    return result;
  }

  async findAll() {
    const cacheKey = 'locations_all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const locations = await this.prisma.location.findMany({ orderBy: { name: 'asc' } });
    await this.cacheManager.set(cacheKey, locations);
    return locations;
  }

  async findOne(id: string) {
    const cacheKey = `location_${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const location = await this.prisma.location.findUnique({ where: { id } });
    if (location) await this.cacheManager.set(cacheKey, location);
    return location;
  }

  async update(id: string, data: any) {
    const result = await this.prisma.location.update({ where: { id }, data });
    await this.clearCache();
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.location.delete({ where: { id } });
    await this.clearCache();
    return result;
  }

  private async clearCache() {
    // Clear all keys starting with 'location'
    const keys = await this.cacheManager.store.keys();
    const locationKeys = keys.filter(key => key.startsWith('location'));
    await Promise.all(locationKeys.map(key => this.cacheManager.del(key)));
  }
}
