import { relations } from 'drizzle-orm';
import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { orders } from '@/lib/db/schema/orders';

export const productTypesEnum = pgEnum('product_types', [
  'Joki Bundle',
  'Joki Perbintang',
  'Joki Classic',
  'Joki MCL',
]);

export const products = table('products', {
  id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar('name', { length: 255 }).notNull(),
  price: t.integer('price').notNull(),
  discountPrice: t.integer('discount_price').notNull(),
  code: t.varchar('code', { length: 10 }).notNull(),
  type: productTypesEnum().notNull(),
  logo: t.text('logo').notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  orders: many(orders),
}));
