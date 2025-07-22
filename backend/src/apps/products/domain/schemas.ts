import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

import { products } from '@/lib/db/schema/products';

export const createProductSchema = createInsertSchema(products);
export const updateProductSchema = createUpdateSchema(products);

export const getProductQuerySchema = z
  .strictObject({
    productId: z.coerce.number().optional(),
    productCode: z.string().optional(),
    productType: z
      .enum(['Joki Bundle', 'Joki Perbintang', 'Joki Classic', 'Joki MCL'])
      .optional(),

    sort: z.enum(['asc', 'desc']).default('asc'),
  })
  .refine(
    ({ productCode, productId, productType }) => {
      return !(productCode && productId && productType);
    },
    {
      /* prevent both filters from being used at once */
      message:
        'Only one filter (productId, productCode, or productType) allowed',
      path: ['query'],
    },
  );

export const deleteProductQuerySchema = z
  .strictObject({
    productId: z.coerce.number().optional(),
    productCode: z.string().optional(),
  })
  .refine(
    ({ productCode, productId }) => {
      /* require at least one of productId or productCode */
      return !productCode || !productId;
    },
    {
      message: 'Either productId or productCode must be provided',
      path: ['query'],
    },
  )
  .refine(
    ({ productCode, productId }) => {
      /* prevent both filters from being used at once */
      return !(productCode && productId);
    },
    {
      message: 'Only one filter (productId or productCode) allowed',
      path: ['query'],
    },
  );

export const updateProductBodySchema = z.object({
  productCode: z.string(),
  productFields: updateProductSchema,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;

export type GetProductQuerySchema = z.infer<typeof getProductQuerySchema>;
export type DeleteProductQuerySchema = z.infer<typeof deleteProductQuerySchema>;
