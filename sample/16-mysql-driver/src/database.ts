import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import { schema } from './schema';

export type AppDatabase = MySql2Database<typeof schema>;

export interface DatabaseHandle {
  db: AppDatabase;
  pool: {
    end: () => Promise<void>;
  };
}

export function createDatabase(): DatabaseHandle {
  const connectionString = process.env.NEST_DRIZZLE_NATIVE_MYSQL_URL;

  if (!connectionString) {
    throw new Error(
      'NEST_DRIZZLE_NATIVE_MYSQL_URL is required for the MySQL sample.',
    );
  }

  const mysql = require('mysql2/promise') as {
    createPool: (url: string) => unknown;
  };
  const pool = mysql.createPool(connectionString) as {
    end: () => Promise<void>;
  };
  const db = drizzle(pool as never, {
    schema,
    mode: 'default',
  });

  return { db, pool };
}
