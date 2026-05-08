import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const auditEvents = mysqlTable('sample_16_audit_events', {
  id: int('id').primaryKey().autoincrement(),
  action: varchar('action', { length: 120 }).notNull(),
  actor: varchar('actor', { length: 80 }).notNull(),
  createdAt: varchar('created_at', { length: 32 }).notNull(),
});

export const schema = { auditEvents };
