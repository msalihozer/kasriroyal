
import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    sendMessage(@Body() body: any) {
        return this.contactService.sendMessage(body);
    }
}
