import { sql, Table } from 'drizzle-orm';

import db, { DB } from '@/lib/db';
import { products as productsTable } from '@/lib/db/schema/products';
import { seed as productSeed } from '@/lib/db/seeds/product';

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
  for (const table of [productsTable]) {
    await resetTable(db, table);
  }

  await productSeed(db);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding is done.');
    process.exit(0);
  });
