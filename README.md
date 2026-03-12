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
├── rabbitmq.deserializer.ts         # Deserializer customizado para mensagens Laravel
├── app.module.ts
└── main.ts                          # Bootstrap como NestJS Microservice via RMQ
```

## Fluxo

```
ms-users (Laravel)
       │ publica evento user.registered (somente após persistência confirmada)
       ▼
   RabbitMQ ──── fila: notification_events
       │ consome
       ▼
ms-notifications (NestJS)
       │ @EventPattern('user.registered')
       ▼
  MailService → Mailtrap (e-mail de boas-vindas)
```

> O ms-notifications escuta `user.registered` (publicado pelo ms-users após salvar no banco),
> não `user.created` (publicado pelo ms-producer). Isso garante que o e-mail só é enviado
> quando o cadastro foi realmente persistido.

## Pré-requisitos

- RabbitMQ rodando via [microservices-infra](https://github.com/matheuspdias/microservices-infra)
- ms-users rodando via [matheuspdias/ms-users](https://github.com/matheuspdias/ms-users)
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
RABBITMQ_QUEUE=notification_events

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

| Evento | Fila | Origem | Ação |
|---|---|---|---|
| `user.registered` | `notification_events` | ms-users | Envia e-mail de boas-vindas |

### Formato esperado

```json
{
  "event_id": "notif_656f8e4a5d1c83.12345678",
  "event_type": "user.registered",
  "timestamp": "2025-11-27T23:30:00Z",
  "payload": {
    "name": "João da Silva",
    "email": "joao.silva@example.com"
  },
  "metadata": {
    "source": "ms-users",
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
- **Deserializer customizado** para compatibilidade com mensagens publicadas por outros stacks (Laravel)
- **Módulos e injeção de dependência** idiomáticos do NestJS
- **TypeScript** com tipagem forte dos eventos
- **Separação de responsabilidades** — Controller recebe, Service processa, MailService envia
- **Multi-stage Docker build** para imagem de produção enxuta

## Licença

MIT
