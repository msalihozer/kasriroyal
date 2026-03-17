
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ReservationsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private whatsappService: WhatsappService,
    ) { }

    async create(data: any) {
        const reservation = await this.prisma.reservation.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                city: data.city,
                personCount: parseInt(data.personCount),
                tourId: data.tourId,
                tourName: data.tourName,
                note: data.note,
            },
        });

        // Send Email
        const emailHtml = `
      <h2>Yeni Başvuru Geldi</h2>
      <p><strong>Tur:</strong> ${data.tourName || 'Genel'}</p>
      <p><strong>İsim:</strong> ${data.name}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || '-'}</p>
      <p><strong>Şehir:</strong> ${data.city || '-'}</p>
      <p><strong>Kişi Sayısı:</strong> ${data.personCount}</p>
      <p><strong>Not:</strong> ${data.note || '-'}</p>
    `;
        this.emailService.sendNotificationToAdmin('Yeni Tur Başvurusu', emailHtml).catch(console.error);

        // Send WhatsApp
        const whatsappMsg = `🔔 *Yeni Tur Başvurusu*\n\n*Tur:* ${data.tourName || 'Genel'}\n*İsim:* ${data.name}\n*Telefon:* ${data.phone}\n*Kişi Sayısı:* ${data.personCount}\n*Not:* ${data.note || '-'}`;
        this.whatsappService.sendMessage(whatsappMsg).catch(console.error);

        return reservation;
    }

    async findAll() {
        return this.prisma.reservation.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.reservation.update({
            where: { id },
            data: { status },
        });
    }

    async remove(id: string) {
        return this.prisma.reservation.delete({
            where: { id },
        });
    }
}
