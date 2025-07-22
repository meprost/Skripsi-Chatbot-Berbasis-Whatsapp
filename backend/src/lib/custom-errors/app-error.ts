import type { HttpStatusCode } from '@/lib/http/http-status';

export interface ErrorDetails {
  field: string;
  message: string;
}

export interface SerializeErrors {
  message: string;
  code: string;
  details?: ErrorDetails | ErrorDetails[];
}

export default abstract class AppError extends Error {
  abstract code: string;
  abstract httpStatusCode: HttpStatusCode;

  constructor(description: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'APP_ERROR';

    Error.captureStackTrace(this);
  }

  abstract serializedErrors(): SerializeErrors;

  getReadableCode(): string {
    return this.code
      .toLowerCase()
      .split('_')
      .map((str) => str[0]?.toUpperCase() + str.substring(1))
      .join(' ');
  }
}
