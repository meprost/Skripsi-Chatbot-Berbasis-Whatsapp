import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { orders } from '@/lib/db/schema/orders';

export const payments = table('payments', {
  id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: t.integer('order_id').references(() => orders.id),
  amount: t.integer('amount').notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
    relationName: 'order',
  }),
}));
