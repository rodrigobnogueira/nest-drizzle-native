import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  balance: integer('balance').notNull(),
});

export const ledgerEntries = sqliteTable('ledger_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fromAccountId: integer('from_account_id').notNull(),
  toAccountId: integer('to_account_id').notNull(),
  amount: integer('amount').notNull(),
  note: text('note').notNull(),
});

export const schema = { accounts, ledgerEntries };
