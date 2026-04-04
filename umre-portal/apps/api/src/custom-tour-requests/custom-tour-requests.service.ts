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
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : null,
                personCount: Number(data.adultCount || 0) + Number(data.childCount || 0),
                adultCount: Number(data.adultCount || 0),
                childCount: Number(data.childCount || 0),
            },
        });

        // Send Email
        const emailHtml = `
      <h2>Yeni Özel Tur Talebi</h2>
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <p><strong>Müşteri:</strong> ${data.fullName}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email || '-'}</p>
        <hr />
        <p><strong>Kişi Sayısı:</strong> ${data.adultCount} Yetişkin, ${data.childCount} Çocuk</p>
        <p><strong>Planlanan Tarih:</strong> ${data.startDate || '-'}</p>
        <p><strong>Kalkış Yeri:</strong> ${data.departureCity || '-'}</p>
        <p><strong>Havayolu:</strong> ${data.airline || '-'} (${data.flightClass || 'Ekonomi'})</p>
        <hr />
        <p><strong>Mekke Süresi:</strong> ${data.mekkeDays} Gece</p>
        <p><strong>Mekke Oteli:</strong> ${data.mekkeHotel || 'Seçilmedi / Diğer'}</p>
        <p><strong>Medine Süresi:</strong> ${data.medineDays} Gece</p>
        <p><strong>Medine Oteli:</strong> ${data.medineHotel || 'Seçilmedi / Diğer'}</p>
        <hr />
        <p><strong>Ara Transfer Arac:</strong> ${data.vehicle || 'Seçilmedi'}</p>
        <p><strong>Rehber Hizmeti:</strong> ${data.guideRequested ? 'Evet' : 'Hayır'}</p>
        <p><strong>Mesaj:</strong> ${data.message || '-'}</p>
      </div>
    `;
        this.emailService.sendNotificationToAdmin('Yeni Özel Tur Talebi', emailHtml).catch(console.error);

        // Send WhatsApp
        const whatsappMsg = `🌟 *Yeni Özel Tur Talebi*\n\n*İsim:* ${data.fullName}\n*Telefon:* ${data.phone}\n*Kişi:* ${data.adultCount}Y + ${data.childCount}Ç\n*Tarih:* ${data.startDate || '-'}\n*Uçuş:* ${data.departureCity || '-'} / ${data.airline || '-'}\n*Oteller:* ${data.mekkeHotel || '-'} & ${data.medineHotel || '-'}\n*Mesaj:* ${data.message || '-'}`;
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
