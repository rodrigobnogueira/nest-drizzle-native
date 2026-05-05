import 'reflect-metadata';
import assert from 'node:assert/strict';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function smoke(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0, '127.0.0.1');

  try {
    const baseUrl = await app.getUrl();
    const before = await getNotes(baseUrl);
    const created = await createNote(baseUrl, 'Injected Drizzle client');
    const after = await getNotes(baseUrl);

    assert.equal(created.title, 'Injected Drizzle client');
    assert.equal(after.length, before.length + 1);
    assert.equal(after[0]?.title, 'Injected Drizzle client');
  } finally {
    await app.close();
  }
}

async function getNotes(baseUrl: string): Promise<Array<{ title: string }>> {
  const response = await fetch(`${baseUrl}/notes`);
  assert.equal(response.status, 200);
  return response.json() as Promise<Array<{ title: string }>>;
}

async function createNote(
  baseUrl: string,
  title: string,
): Promise<{ title: string }> {
  const response = await fetch(`${baseUrl}/notes`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  assert.equal(response.status, 201);
  return response.json() as Promise<{ title: string }>;
}

void smoke().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
