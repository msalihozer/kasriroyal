import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ToursModule } from './tours/tours.module';
import { HotelsModule } from './hotels/hotels.module';
import { PagesModule } from './pages/pages.module';
import { PostsModule } from './posts/posts.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SiteSettingsModule } from './settings/settings.module';
import { UploadsModule } from './uploads/uploads.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqModule } from './faq/faq.module';
import { EmailModule } from './email/email.module';
import { CommentsModule } from './comments/comments.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ContactModule } from './contact/contact.module';
import { CustomTourRequestsModule } from './custom-tour-requests/custom-tour-requests.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AirlinesModule } from './airlines/airlines.module';
import { IpBlockMiddleware } from './common/ip-block.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({
            isGlobal: true,
            ttl: 3600000, // 1 hour in milliseconds
            max: 1000, // maximum number of items in cache
        }),
        ThrottlerModule.forRoot([
            { name: 'short',  ttl: 1000,  limit: 15  },
            { name: 'medium', ttl: 10000, limit: 60  },
            { name: 'long',   ttl: 60000, limit: 250 },
        ]),
        ServeStaticModule.forRoot(
            {
                rootPath: join(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            },
            {
                rootPath: join(process.cwd(), 'apps/api/uploads'),
                serveRoot: '/uploads',
            }
        ),
        PrismaModule,
        AuthModule,
        ToursModule,
        HotelsModule,
        PagesModule,
        PostsModule,
        VehiclesModule,
        SiteSettingsModule,
        UploadsModule,
        TestimonialsModule,
        FaqModule,
        EmailModule,
        CommentsModule,
        ReservationsModule,
        ContactModule,
        CustomTourRequestsModule,
        AnalyticsModule,
        WhatsappModule,
        AirlinesModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(IpBlockMiddleware).forRoutes('*');
    }
}
