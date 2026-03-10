
import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
    constructor(private emailService: EmailService) { }

    async sendMessage(data: any) {
        const { name, email, subject, message } = data;

        const emailHtml = `
      <h2>Yeni İletişim Mesajı</h2>
      <p><strong>İsim:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Konu:</strong> ${subject}</p>
      <p><strong>Mesaj:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

        // Send to Admin
        await this.emailService.sendNotificationToAdmin(`İletişim Formu: ${subject}`, emailHtml);

        return { success: true };
    }
}
