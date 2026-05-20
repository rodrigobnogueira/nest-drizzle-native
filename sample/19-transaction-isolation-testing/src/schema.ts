import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const inventoryItems = sqliteTable('inventory_items', {
  sku: text('sku').primaryKey(),
  quantity: integer('quantity').notNull(),
});

export const inventoryEvents = sqliteTable('inventory_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sku: text('sku').notNull(),
  delta: integer('delta').notNull(),
  reason: text('reason').notNull(),
});

export const schema = { inventoryEvents, inventoryItems };
