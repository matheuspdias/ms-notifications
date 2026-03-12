import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

interface UserCreatedEvent {
  event_id: string;
  event_type: string;
  timestamp: string;
  payload: {
    name: string;
    email: string;
  };
  metadata: {
    source: string;
    version: string;
    environment: string;
  };
}

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
    this.logger.log(
      `Event received: user.created | event_id=${data.event_id} | email=${data.payload.email}`,
    );

    await this.notificationsService.notifyUserCreated(
      data.payload.name,
      data.payload.email,
    );
  }
}
