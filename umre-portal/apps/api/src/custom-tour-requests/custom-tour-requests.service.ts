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

        // Date Look & Feel Improvements
        const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        const df = new Intl.DateTimeFormat('tr-TR', dateOptions);

        const formattedStartDate = request.startDate ? df.format(request.startDate) : 'Belirtilmedi';
        const now = new Intl.DateTimeFormat('tr-TR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(new Date());

        // Send Email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #1a365d; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">YENİ ÖZEL TUR TALEBİ</h2>
                    <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.8;">Tarih: ${now}</p>
                </div>
                
                <div style="padding: 25px;">
                    <h3 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">İletişim Bilgileri</h3>
                    <div style="margin-bottom: 20px;">
                        <p><strong>Ad Soyad:</strong> ${request.fullName}</p>
                        <p><strong>Telefon:</strong> ${request.phone}</p>
                        <p><strong>E-posta:</strong> ${request.email || '-'}</p>
                    </div>

                    <h3 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Konaklama & Tarih</h3>
                    <div style="margin-bottom: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7; width: 35%;"><strong>Planlanan Gidiş:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7; color: #bda569; font-weight: bold;">${formattedStartDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7;"><strong>Kişi Sayısı:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${request.adultCount} Yetişkin, ${request.childCount} Çocuk</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7;"><strong>Mekke Süresi:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${request.mekkeDays} Gece</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7;"><strong>Mekke Oteli:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${(request.hotelSelection as any)?.mekke || 'Seçilmedi / Diğer'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7;"><strong>Medine Süresi:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${request.medineDays} Gece</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8fafc; border-bottom: 1px solid #edf2f7;"><strong>Medine Oteli:</strong></td>
                                <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${(request.hotelSelection as any)?.medine || 'Seçilmedi / Diğer'}</td>
                            </tr>
                        </table>
                    </div>

                    <h3 style="color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Ulaşım & Ekstra</h3>
                    <div style="margin-bottom: 20px;">
                        <p><strong>Kalkış Havalimanı:</strong> ${request.departureCity || 'Belirtilmedi'}</p>
                        <p><strong>Tercihen Havayolu:</strong> ${request.airline || '-'} (${request.flightClass || 'Ekonomi'})</p>
                        <p><strong>Ara Transfer Aracı:</strong> ${request.vehicleSelection || 'Seçilmedi'}</p>
                        <p><strong>Rehberlik Hizmeti:</strong> ${request.guideRequested ? 'Evet, istiyorum' : 'Hayır, istemiyorum'}</p>
                    </div>

                    <div style="background-color: #fffaf0; border: 1px solid #feebc8; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #9c4221;">Müşteri Mesajı:</h4>
                        <p style="margin: 0; color: #7b341e; font-style: italic;">"${request.message || 'Mesaj bırakılmadı.'}"</p>
                    </div>
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
                    Bu mail otomatik olarak Kasri Royal Özel Tur Planlama portalından gönderilmiştir.
                </div>
            </div>
        `;
        this.emailService.sendNotificationToAdmin('Yeni Özel Tur Talebi: ' + data.fullName, emailHtml).catch(console.error);

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
