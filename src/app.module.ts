import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [MailModule, NotificationsModule],
})
export class AppModule {}
