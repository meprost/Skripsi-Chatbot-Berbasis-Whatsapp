import { defineConfig } from 'drizzle-kit';

import env from './src/lib/env';

export default defineConfig({
  out: 'src/lib/db/drizzle',
  schema: 'src/lib/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL,
  },
});
