import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMQDeserializer } from './rabbitmq.deserializer';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://rabbit:rabbit@rabbitmq:5672'],
        queue: process.env.RABBITMQ_QUEUE ?? 'notification_events',
        queueOptions: {
          durable: true,
        },
        deserializer: new RabbitMQDeserializer(),
      },
    },
  );

  await app.listen();
  console.log('ms-notifications is listening on RabbitMQ queue: notification_events');
}

bootstrap();
