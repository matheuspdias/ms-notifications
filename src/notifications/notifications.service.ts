import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailService: MailService) {}

  async notifyUserCreated(name: string, email: string): Promise<void> {
    try {
      await this.mailService.sendWelcomeEmail(name, email);
      this.logger.log(`Notification processed for user: ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to ${email}: ${error.message}`,
      );
      throw error;
    }
  }
}
