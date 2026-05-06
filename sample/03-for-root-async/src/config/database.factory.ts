import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { DatabaseConfigService } from './database-config.service';
import { DatabaseLifecycleTracker } from './database-lifecycle.tracker';
import { schema } from '../schema';

export type AppDatabase = LibSQLDatabase<typeof schema> & {
  $client: Client;
};

export async function createDatabase(
  config: DatabaseConfigService,
  tracker: DatabaseLifecycleTracker,
): Promise<AppDatabase> {
  tracker.recordFactoryCall();
  const client = createClient({ url: config.databaseUrl });
  return drizzle(client, { schema });
}
