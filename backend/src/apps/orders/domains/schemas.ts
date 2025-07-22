import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { orders } from '@/lib/db/schema/orders';
import { ordersData } from '@/lib/db/schema/orders-data';

export const createOrderBodySchema = z.object({
  productCode: z.string(),
});

export const createOrderDataBodySchema = z.object({
  orderId: z.number(),
  nickname: z.string(),
  accountId: z.string(),
  loginMethod: z.string(),
  email: z.email(),
  password: z.string(),
  heroesRequest: z.string(),
});

export const createOrderSchema = createInsertSchema(orders);
export const updateOrderSchema = createUpdateSchema(orders);
export const createOrderDataSchema = createInsertSchema(ordersData);
export const updateOrderDataSchema = createUpdateSchema(ordersData);

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
export type CreateOrderDataSchema = z.infer<typeof createOrderDataSchema>;
export type UpdateOrderDataSchema = z.infer<typeof updateOrderDataSchema>;
