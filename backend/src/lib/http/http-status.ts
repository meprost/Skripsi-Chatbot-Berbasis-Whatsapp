export const HttpStatusCode = {
  BadRequest: 400,
  Created: 201,
  InternalServerError: 500,
  NotFound: 404,
  OK: 200,
  Unauthorized: 401,
} as const;

export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];
