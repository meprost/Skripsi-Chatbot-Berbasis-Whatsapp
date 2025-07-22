import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { ordersData } from '@/lib/db/schema/orders-data';
import { payments } from '@/lib/db/schema/payments';
import { products } from '@/lib/db/schema/products';

export const orders = table('orders', {
  id: t.integer('id').primaryKey().generatedAlwaysAsIdentity().notNull(),
  orderReference: t.varchar('order_reference', { length: 12 }).notNull(),
  productId: t
    .integer('product_id')
    .references(() => products.id, { onDelete: 'set null' }),
  additionalPrice: t.integer().notNull(),
  orderedAt: t.timestamp().defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
    relationName: 'product',
  }),
  payment: one(payments),
  orderData: one(ordersData),
}));
