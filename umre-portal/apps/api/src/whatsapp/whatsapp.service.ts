
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class WhatsappService {
    constructor(private prisma: PrismaService) { }

    async sendMessage(message: string) {
        const settings = await this.prisma.emailSettings.findFirst();
        
        if (!settings || !settings.whatsappEnabled || !settings.whatsappInstanceId || !settings.whatsappToken || !settings.whatsappPhone) {
            return false;
        }

        try {
            const url = `https://api.ultramsg.com/${settings.whatsappInstanceId}/messages/chat`;
            const response = await axios.post(url, {
                token: settings.whatsappToken,
                to: settings.whatsappPhone,
                body: message,
                priority: 10
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            return false;
        }
    }
}
