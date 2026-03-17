import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class CustomTourRequestsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private whatsappService: WhatsappService,
    ) { }

    async create(data: any) {
        const request = await this.prisma.customTourRequest.create({
            data,
        });

        // Send Email
        const emailHtml = `
      <h2>Yeni Özel Tur Talebi</h2>
      <p><strong>Müşteri:</strong> ${data.fullName}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Kişi Sayısı:</strong> ${data.personCount}</p>
      <p><strong>Mekke Gün:</strong> ${data.mekkeDays || '-'}</p>
      <p><strong>Medine Gün:</strong> ${data.medineDays || '-'}</p>
      <p><strong>Tercihler:</strong> ${data.hotelChoiceType || '-'}</p>
      <p><strong>Mesaj:</strong> ${data.message || '-'}</p>
    `;
        this.emailService.sendNotificationToAdmin('Yeni Özel Tur Talebi', emailHtml).catch(console.error);

        // Send WhatsApp
        const whatsappMsg = `🌟 *Yeni Özel Tur Talebi*\n\n*İsim:* ${data.fullName}\n*Telefon:* ${data.phone}\n*Kişi:* ${data.personCount}\n*Mesaj:* ${data.message || '-'}`;
        this.whatsappService.sendMessage(whatsappMsg).catch(console.error);

        return request;
    }

    async findAll() {
        return this.prisma.customTourRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.customTourRequest.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.customTourRequest.update({
            where: { id },
            data,
        });
    }
    async remove(id: string) {
        return this.prisma.customTourRequest.delete({
            where: { id },
        });
    }
}
