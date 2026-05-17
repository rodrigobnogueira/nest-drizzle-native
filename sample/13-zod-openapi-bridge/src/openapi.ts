import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Support Ticket API')
    .setDescription('App-owned Zod validation with explicit Swagger/OpenAPI DTOs')
    .setVersion('1.0.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}
