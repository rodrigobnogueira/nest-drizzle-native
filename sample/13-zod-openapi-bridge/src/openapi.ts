import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Support Ticket API')
    .setDescription('Drizzle-Zod validation with explicit Swagger DTOs')
    .setVersion('1.0.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}
