# MS Notifications - Microserviço de Notificações

Microserviço consumer em **NestJS** que escuta eventos do RabbitMQ e envia e-mails transacionais via **Mailtrap**.

## Tecnologias

- Node.js 20 + TypeScript
- NestJS 10
- NestJS Microservices (`@nestjs/microservices`)
- RabbitMQ (AMQP)
- Nodemailer + Mailtrap
- Docker

## Arquitetura

```
src/
├── notifications/
│   ├── notifications.module.ts      # Módulo principal
│   ├── notifications.controller.ts  # @EventPattern — recebe eventos do RabbitMQ
│   └── notifications.service.ts     # Orquestra o envio das notificações
│
├── mail/
│   ├── mail.module.ts               # Módulo de e-mail
│   └── mail.service.ts              # Nodemailer + Mailtrap
│
├── app.module.ts
└── main.ts                          # Bootstrap como NestJS Microservice via RMQ
```

## Fluxo

```
ms-producer (Laravel)
       │ publica evento user.created
       ▼
   RabbitMQ ──── fila: user_events
       │ consome
       ▼
ms-notifications (NestJS)
       │ @EventPattern('user.created')
       ▼
  MailService → Mailtrap (e-mail de boas-vindas)
```

## Pré-requisitos

- RabbitMQ rodando via [microservices-infra](https://github.com/matheuspdias/microservices-infra)
- Conta no [Mailtrap](https://mailtrap.io) para capturar os e-mails

## Instalação

```bash
git clone https://github.com/matheuspdias/ms-notifications.git
cd ms-notifications

cp .env.example .env
# preencha MAIL_USER e MAIL_PASS com as credenciais do Mailtrap
```

## Configuração

```env
# RabbitMQ
RABBITMQ_URL=amqp://rabbit:rabbit@rabbitmq:5672
RABBITMQ_QUEUE=user_events

# Mailtrap SMTP
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_pass
MAIL_FROM_NAME=Microservices App
MAIL_FROM_ADDRESS=noreply@app.com
```

> As credenciais SMTP estão em **Mailtrap → Email Testing → SMTP Settings**.

## Subindo o serviço

```bash
docker compose up -d --build
```

> A rede `microservices-net` deve estar criada pela infra antes de subir este serviço.

## Eventos suportados

| Evento | Ação |
|---|---|
| `user.created` | Envia e-mail de boas-vindas |

### Formato esperado

```json
{
  "event_id": "user_656f8e4a5d1c83.12345678",
  "event_type": "user.created",
  "timestamp": "2025-11-27T23:30:00Z",
  "payload": {
    "name": "João da Silva",
    "email": "joao.silva@example.com"
  },
  "metadata": {
    "source": "ms-producer",
    "version": "1.0",
    "environment": "local"
  }
}
```

## Comandos úteis

```bash
# Ver logs
docker compose logs -f ms-notifications

# Parar o serviço
docker compose down

# Rebuild
docker compose up -d --build
```

## Conceitos demonstrados

- **NestJS Microservices** com transporte AMQP nativo
- **`@EventPattern`** para consumir eventos de forma declarativa
- **Módulos e injeção de dependência** idiomáticos do NestJS
- **TypeScript** com tipagem forte dos eventos
- **Separação de responsabilidades** — Controller recebe, Service processa, MailService envia
- **Multi-stage Docker build** para imagem de produção enxuta

## Licença

MIT
