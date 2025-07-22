import type { Response } from 'express';

import AppError from '@/lib/custom-errors/app-error';
import { sendErrorResponse } from '@/lib/http/http-response';
import logger from '@/lib/logger';

class ErrorHandler {
  public async handleError(
    error: Error,
    responseStream: Response,
  ): Promise<void> {
    /* Log Error */
    if (error instanceof AppError) {
      logger.child({ module: 'error-handler' }).error(
        {
          error: error.name,
          description: error.message,
          code: error.code,
          statusCode: error.httpStatusCode,
        },
        '[Error Handler]: App Error',
      );
    } else {
      logger.child({ module: 'error-handler' }).error(
        {
          error: error.name,
          description: error.message,
          stack: error.stack,
        },
        '[Error Handler]: Unknown Error',
      );
    }

    /* Send http response */
    sendErrorResponse(responseStream, error);
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
