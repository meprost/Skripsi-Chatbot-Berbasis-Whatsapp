import { ZodError } from 'zod/v4';

import AppError, {
  ErrorDetails,
  SerializeErrors,
} from '@/lib/custom-errors/app-error';
import { HttpStatusCode } from '@/lib/http/http-status';

export class RouteNotFound extends AppError {
  public readonly code: string;
  public readonly httpStatusCode: HttpStatusCode;

  constructor(description: string = 'The requested route not found') {
    super(description);

    this.name = 'RouteNotFound';
    this.code = 'ROUTE_NOT_FOUND';
    this.httpStatusCode = HttpStatusCode.NotFound;
  }

  serializedErrors(): SerializeErrors {
    return {
      code: this.code,
      details: {
        field: 'Ur Ass.',
        message: 'Requesting to the unknow route in a row can be banned',
      },
      message: this.message,
    };
  }
}

export class ZodValidationError extends AppError {
  public readonly code: string;
  public readonly httpStatusCode: HttpStatusCode;
  private readonly errorDetails: ErrorDetails[];

  constructor({
    from,
    context,
    error,
  }: {
    from: string;
    context: string;
    error: ZodError;
  }) {
    super(`[${from}]: ${context}`);

    this.name = 'ZodValidationError';
    this.code = 'VALIDATION_ERROR';
    this.httpStatusCode = HttpStatusCode.BadRequest;

    this.errorDetails = error.issues.map<ErrorDetails>((issue) => {
      return {
        field: issue.path.join(', '),
        message: issue.message.replaceAll(/\|/g, ' or ').replace(/"/g, ''),
      };
    });
  }

  serializedErrors(): SerializeErrors {
    return {
      code: this.code,
      message: 'Please check detailed message below.',
      details: this.errorDetails,
    };
  }
}
