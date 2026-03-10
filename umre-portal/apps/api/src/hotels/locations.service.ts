import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) { }

  create(createLocationDto: any) {
    return this.prisma.location.create({ data: createLocationDto });
  }

  findAll() {
    return this.prisma.location.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({ where: { id } });
  }

  update(id: string, updateLocationDto: any) {
    return this.prisma.location.update({ where: { id }, data: updateLocationDto });
  }

  remove(id: string) {
    return this.prisma.location.delete({ where: { id } });
  }
}
