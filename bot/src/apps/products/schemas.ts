import { z } from 'zod/v4';

export const productTypeSchema = z.literal([
  'Joki Bundle',
  'Joki Perbintang',
  'Joki Classic',
  'Joki MCL',
]);

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  discountPrice: z.number(),
  code: z.string(),
  type: productTypeSchema,
  logo: z.string(),
});

export const createProductSchema = productSchema.omit({ id: true });
export const updateProductSchema = productSchema.omit({ id: true });
export const deleteProductSchema = productSchema.pick({ code: true });

export type Product = z.infer<typeof productSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;
