import type { Response } from 'express';

import AppError from '@/lib/custom-errors/app-error';

export const sendErrorResponse = <E = unknown>(res: Response, err: E) => {
  if (err instanceof AppError) {
    res.status(err.httpStatusCode).json({
      success: false,
      error: {
        ...err.serializedErrors(),
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error',
      },
    });
  }
};

export const sendResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};
