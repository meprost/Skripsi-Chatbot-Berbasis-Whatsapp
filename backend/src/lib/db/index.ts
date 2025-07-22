import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import env from '@/lib/env';

const pool = new Pool({
  connectionString: env.DB_URL,
});

const db = drizzle({ client: pool });

export default db;

export type DB = typeof db;
