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
        const now = new Intl.DateTimeFormat('tr-TR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(new Date());
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="background-color: #bda569; padding: 24px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">YENİ TUR BAŞVURUSU</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">Tarih: ${now}</p>
                </div>
                
                <div style="padding: 32px; background-color: #ffffff;">
                    <h3 style="color: #1a202c; border-bottom: 2px solid #f7fafc; padding-bottom: 12px; margin-bottom: 16px;">Müşteri Bilgileri</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #718096; width: 40%;">Ad Soyad:</td>
                            <td style="padding: 8px 0; color: #1a202c; font-weight: bold;">${data.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #718096;">Telefon:</td>
                            <td style="padding: 8px 0; color: #1a202c; font-weight: bold;">${data.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #718096;">E-posta:</td>
                            <td style="padding: 8px 0; color: #1a202c;">${data.email || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #718096;">Şehir:</td>
                            <td style="padding: 8px 0; color: #1a202c;">${data.city || '-'}</td>
                        </tr>
                    </table>

                    <h3 style="color: #1a202c; border-bottom: 2px solid #f7fafc; padding-bottom: 12px; margin-top: 32px; margin-bottom: 16px;">Başvuru Detayları</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #718096; width: 40%;">İlgilenilen Tur:</td>
                            <td style="padding: 8px 0; color: #1a202c; font-weight: bold;">${data.tourName || 'Genel Başvuru'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #718096;">Kişi Sayısı:</td>
                            <td style="padding: 8px 0; color: #1a202c;">${data.personCount} Kişi</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #718096;">Müşteri Notu:</td>
                            <td style="padding: 8px 0; color: #4a5568; font-style: italic;">"${data.note || '-'}"</td>
                        </tr>
                    </table>
                </div>

                <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7;">
                    <p style="margin: 0; font-size: 13px; color: #a0aec0;">Bu bildirim otomatik olarak Kasri Royal tur yönetim portalından gönderilmiştir.</p>
                </div>
            </div>
        `;
        this.emailService.sendNotificationToAdmin('Yeni Tur Başvurusu: ' + data.name, emailHtml).catch(console.error);

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
