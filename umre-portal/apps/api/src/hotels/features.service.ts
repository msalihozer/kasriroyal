import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) { }

  create(createFeatureDto: any) {
    return this.prisma.hotelFeature.create({ data: createFeatureDto });
  }

  async createMany(data: any[]) {
    // Prisma createMany is only supported on some databases, 
    // but here we can loop or use it if available.
    // Assuming MySQL/Postgres for umre-portal
    return this.prisma.hotelFeature.createMany({ data });
  }

  findAll() {
    return this.prisma.hotelFeature.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.hotelFeature.findUnique({ where: { id } });
  }

  update(id: string, updateFeatureDto: any) {
    return this.prisma.hotelFeature.update({ where: { id }, data: updateFeatureDto });
  }

  remove(id: string) {
    return this.prisma.hotelFeature.delete({ where: { id } });
  }
}
