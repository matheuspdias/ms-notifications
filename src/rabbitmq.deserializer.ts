import { ConsumerDeserializer, IncomingRequest } from '@nestjs/microservices';

export class RabbitMQDeserializer implements ConsumerDeserializer {
  deserialize(value: any): IncomingRequest {
    const data = typeof value === 'string' ? JSON.parse(value) : value;
    return {
      pattern: data.event_type,
      data,
      id: data.event_id,
    };
  }
}
