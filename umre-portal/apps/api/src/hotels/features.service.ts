import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) { }

  create(createFeatureDto: any) {
    return this.prisma.hotelFeature.create({ data: createFeatureDto });
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
