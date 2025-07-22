import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

import { orders } from '@/lib/db/schema/orders';

export const ordersData = table('orders_data', {
  id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: t.integer('order_id').references(() => orders.id),
  nickname: t.varchar('nickname', { length: 255 }).notNull(),
  accountId: t.varchar('account_id', { length: 255 }).notNull(),
  loginMethod: t.varchar('login_method', { length: 255 }).notNull(),
  email: t.varchar('email', { length: 255 }).notNull(),
  password: t.varchar('password', { length: 255 }).notNull(),
  heroesRequest: t.varchar('heroes_request', { length: 255 }).notNull(),
});

export const ordersDataRelations = relations(ordersData, ({ one }) => ({
  order: one(orders, {
    fields: [ordersData.orderId],
    references: [orders.id],
  }),
}));
