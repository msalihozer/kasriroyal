
import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailSettingsController } from './email-settings.controller';

@Global()
@Module({
    controllers: [EmailSettingsController],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
