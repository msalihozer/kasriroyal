import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { LocationsModule } from './locations.module';
import { FeaturesModule } from './features.module';

@Module({
    controllers: [HotelsController],
    providers: [HotelsService],
    imports: [LocationsModule, FeaturesModule],
})
export class HotelsModule { }
