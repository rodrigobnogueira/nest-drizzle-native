import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const systemEvents = sqliteTable('system_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  source: text('source').notNull(),
});

export const schema = { systemEvents };
