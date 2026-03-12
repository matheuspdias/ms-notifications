import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST ?? 'sandbox.smtp.mailtrap.io',
      port: Number(process.env.MAIL_PORT ?? 2525),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME ?? 'Microservices App'}" <${process.env.MAIL_FROM_ADDRESS ?? 'noreply@app.com'}>`,
      to: email,
      subject: 'Welcome!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now use all features of our platform.</p>
      `,
    });

    this.logger.log(`Welcome email sent to ${email}`);
  }
}
