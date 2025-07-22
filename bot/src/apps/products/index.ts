import { z } from 'zod/v4';

import {
  createProductSchema,
  CreateProductSchema,
  deleteProductSchema,
  DeleteProductSchema,
  productSchema,
  updateProductSchema,
  UpdateProductSchema,
} from '@/apps/products/schemas';
import { backendApi } from '@/lib/api';

export const getProducts = async () => {
  const response = await backendApi.get('/product');
  if (!response.data.success) {
    throw new Error('Fetch Product Failed');
  }

  const parseProduct = z.array(productSchema).safeParse(response.data.data);
  if (!parseProduct.success) {
    throw new Error('Parse Product Response Failed');
  }

  return parseProduct.data;
};

export const createProduct = async (product: CreateProductSchema) => {
  const response = await backendApi.post('/product', product);
  if (!response.data.success) {
    throw new Error('Create Product Failed');
  }

  const parseProduct = createProductSchema.safeParse(response.data.data);
  if (!parseProduct.success) {
    throw new Error('Parse Product Response Failed');
  }

  return parseProduct.data;
};

export const updateProduct = async (product: UpdateProductSchema) => {
  const response = await backendApi.put('/product', {
    productCode: product.code,
    productFields: product,
  });
  if (!response.data.success) {
    throw new Error('Update Product Failed');
  }

  const parseProduct = updateProductSchema.safeParse(response.data.data);
  if (!parseProduct.success) {
    throw new Error('Parse Product Response Failed');
  }

  return parseProduct.data;
};

export const deleteProduct = async (product: DeleteProductSchema) => {
  const response = await backendApi.delete(
    `/product?productCode=${product.code}`,
  );
  if (!response.data.success) {
    throw new Error('Delete Product Failed');
  }

  const parseProduct = deleteProductSchema.safeParse(response.data.data);
  if (!parseProduct.success) {
    throw new Error('Parse Product Response Failed');
  }

  return parseProduct.data;
};
