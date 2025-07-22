import type { Request, Response, NextFunction } from 'express';

import {
  createOrderBodySchema,
  createOrderDataBodySchema,
} from '@/apps/orders/domains/schemas';
import { createOrder, createOrderData } from '@/apps/orders/domains/services';
import { ZodValidationError } from '@/lib/custom-errors/route-error';
import { sendResponse } from '@/lib/http/http-response';

export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseBody = createOrderBodySchema.safeParse(req.body);
    if (!parseBody.success) {
      throw new ZodValidationError({
        from: 'Create Order Handler',
        context: 'Invalid Request Body',
        error: parseBody.error,
      });
    }

    const createdOrderDetails = await createOrder(parseBody.data.productCode);

    sendResponse(res, createdOrderDetails);
  } catch (err) {
    next(err);
  }
};

export const createOrderDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parseBody = createOrderDataBodySchema.safeParse(req.body);
    if (!parseBody.success) {
      throw new ZodValidationError({
        from: 'Create Order Data Handler',
        context: 'Invalid Request Body',
        error: parseBody.error,
      });
    }

    const createdOrderData = await createOrderData(parseBody.data);

    sendResponse(res, createdOrderData);
  } catch (err) {
    next(err);
  }
};
