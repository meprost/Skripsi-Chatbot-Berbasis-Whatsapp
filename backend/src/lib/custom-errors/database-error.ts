import AppError, { SerializeErrors } from '@/lib/custom-errors/app-error';
import { HttpStatusCode } from '@/lib/http/http-status';

export class DatabaseError extends AppError {
  public readonly code: string;
  public readonly httpStatusCode: HttpStatusCode;

  constructor(description: string) {
    super(description);

    this.name = 'DatabaseError';
    this.code = 'DATABASE_ERROR';
    this.httpStatusCode = HttpStatusCode.InternalServerError;
  }

  serializedErrors(): SerializeErrors {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export class TransactionEntityNotFound extends AppError {
  public readonly code: string;
  public readonly httpStatusCode: HttpStatusCode;

  constructor(
    public entityName: string,
    public entityId: string | number,
    public context?: string,
  ) {
    super(
      context
        ? `${context}: ${entityName} with ID ${entityId} not found`
        : `${entityName} with ID ${entityId} not found`,
    );

    this.name = 'TransactionEntityNotFound';
    this.code = 'ENTITY_NOT_FOUND';
    this.httpStatusCode = HttpStatusCode.NotFound;
  }

  serializedErrors(): SerializeErrors {
    return {
      code: this.code,
      message: `${this.entityName} with ID ${this.entityId} not found`,
    };
  }
}
