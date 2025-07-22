import { CreateOrderSchema } from '@/apps/orders/domains/schemas';
import db from '@/lib/db';
import { orders as ordersTable } from '@/lib/db/schema/orders';

export const createOrder = (order: CreateOrderSchema) =>
  db
    .insert(ordersTable)
    .values({
      orderReference: order.orderReference,
      productId: order.productId,
      additionalPrice: order.additionalPrice,
    })
    .returning();
