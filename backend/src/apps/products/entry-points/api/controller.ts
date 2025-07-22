import type { Request, Response, NextFunction } from 'express';

import {
  createProductSchema,
  deleteProductQuerySchema,
  getProductQuerySchema,
  updateProductBodySchema,
} from '@/apps/products/domain/schemas';
import {
  createProductTransaction,
  deleteProductTransaction,
  getProductsTransaction,
  updateProductTransaction,
} from '@/apps/products/domain/services';
import { ZodValidationError } from '@/lib/custom-errors/route-error';
import { sendResponse } from '@/lib/http/http-response';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseQuery = getProductQuerySchema.safeParse(req.query);
    if (!parseQuery.success) {
      throw new ZodValidationError({
        from: 'Get Products',
        context: 'Invalid Query Params',
        error: parseQuery.error,
      });
    }

    const products = await getProductsTransaction(parseQuery.data);

    sendResponse(res, products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseBody = createProductSchema.safeParse(req.body);
    if (!parseBody.success) {
      throw new ZodValidationError({
        from: 'Create Product',
        context: 'Invalid Request Body',
        error: parseBody.error,
      });
    }

    const createdProduct = await createProductTransaction(parseBody.data);

    sendResponse(res, createdProduct);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseBody = updateProductBodySchema.safeParse(req.body);
    if (!parseBody.success) {
      throw new ZodValidationError({
        from: 'Update Product',
        context: 'Invalid Request Body',
        error: parseBody.error,
      });
    }

    const updatedProduct = await updateProductTransaction(
      parseBody.data.productCode,
      parseBody.data.productFields,
    );

    sendResponse(res, updatedProduct);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseQuery = deleteProductQuerySchema.safeParse(req.query);
    if (!parseQuery.success) {
      throw new ZodValidationError({
        from: 'Delete Product',
        context: 'Invalid Request Body',
        error: parseQuery.error,
      });
    }

    const deletedProduct = await deleteProductTransaction(parseQuery.data);

    sendResponse(res, deletedProduct);
  } catch (err) {
    next(err);
  }
};
