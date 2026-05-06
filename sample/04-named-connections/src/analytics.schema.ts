import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventName: text('event_name').notNull(),
  subject: text('subject').notNull(),
});

export const analyticsSchema = { analyticsEvents };
