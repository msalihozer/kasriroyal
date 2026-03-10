
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor(private prisma: PrismaService) { }

    async init() {
        const settings = await this.prisma.emailSettings.findFirst();
        if (settings) {
            this.transporter = nodemailer.createTransport({
                host: settings.host,
                port: settings.port,
                secure: settings.port === 465,
                auth: {
                    user: settings.user,
                    pass: settings.pass,
                },
            });
        }
    }

    async sendMail(to: string, subject: string, html: string) {
        if (!this.transporter) {
            await this.init();
        }

        if (!this.transporter) {
            console.error('Email transporter not initialized.');
            return false;
        }

        const settings = await this.prisma.emailSettings.findFirst();
        if (!settings) return false;

        try {
            await this.transporter.sendMail({
                from: `"${settings.fromEmail}" <${settings.user}>`,
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendNotificationToAdmin(subject: string, html: string) {
        const settings = await this.prisma.emailSettings.findFirst();
        if (settings && settings.notificationEmail) {
            return this.sendMail(settings.notificationEmail, subject, html);
        }
        return false;
    }
}
