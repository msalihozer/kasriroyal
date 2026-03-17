import { Module } from '@nestjs/common';
import { CustomTourRequestsService } from './custom-tour-requests.service';
import { CustomTourRequestsController } from './custom-tour-requests.controller';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [CustomTourRequestsController],
    providers: [CustomTourRequestsService],
})
export class CustomTourRequestsModule { }
