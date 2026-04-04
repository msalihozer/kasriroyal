import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor(private prisma: PrismaService) { }

    private sanitizeHost(host: string): string {
        return host.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }

    async init() {
        const settings = await this.prisma.emailSettings.findFirst();
        if (settings) {
            const host = this.sanitizeHost(settings.host);
            const port = parseInt(settings.port.toString());
            
            // SMTP Security Logic:
            // Port 465: Implicit SSL (secure: true)
            // Port 587: STARTTLS (secure: false, but requires TLS)
            // Port 25: Unsecured or STARTTLS (secure: false)
            const secure = port === 465;

            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    user: settings.user,
                    pass: settings.pass,
                },
                tls: {
                    // Do not fail on invalid certs for flexibility
                    rejectUnauthorized: false
                }
            });
        }
    }

    async sendMail(to: string, subject: string, html: string) {
        // Re-init every time to ensure up-to-date settings without complex caching
        await this.init();

        if (!this.transporter) {
            console.error('Email transporter not initialized.');
            return false;
        }

        const settings = await this.prisma.emailSettings.findFirst();
        if (!settings) return false;

        try {
            const info = await this.transporter.sendMail({
                from: `"${settings.fromEmail}" <${settings.user}>`,
                to,
                subject,
                html,
            });
            console.log('Email sent successfully:', info.messageId);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendNotificationToAdmin(subject: string, html: string) {
        const settings = await this.prisma.emailSettings.findFirst();
        if (settings && settings.notificationEmail) {
            // Clean spaces for multiple emails separated by commas
            const cleanedTo = settings.notificationEmail.split(',').map(e => e.trim()).join(',');
            return this.sendMail(cleanedTo, subject, html);
        }
        console.warn('Admin notification email not sent: No notification email address configured.');
        return false;
    }

    async testConnection(settingsDto: any) {
        const host = this.sanitizeHost(settingsDto.host);
        const port = parseInt(settingsDto.port.toString());
        const secure = port === 465;

        const testTransporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: settingsDto.user,
                pass: settingsDto.pass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        try {
            await testTransporter.verify();
            return { success: true, message: 'Bağlantı başarılı. SMTP sunucusu yanıt veriyor.' };
        } catch (error) {
            return { success: false, message: `Bağlantı hatası: ${error.message}` };
        }
    }
}
