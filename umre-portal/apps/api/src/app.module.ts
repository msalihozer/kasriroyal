import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
        }),
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
    ],
})
export class AppModule { }
