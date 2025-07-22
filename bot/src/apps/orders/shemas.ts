import { z } from 'zod/v4';

import { productTypeSchema } from '@/apps/products/schemas';

export const orderSchema = z.object({
  orderId: z.number(),
  orderReference: z.string(),
  productName: z.string(),
  productCode: z.string(),
  productType: productTypeSchema,
  additionalPrice: z.number(),
  totalPrice: z.number(),
  orderedAt: z.string(),
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

export type CreateOrderDataBodySchema = z.infer<
  typeof createOrderDataBodySchema
>;
