export const PUBLIC_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  429: "Too Many Requests",
  500: "Internal Server Error",
};

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage: string;

  constructor(statusCode: number) {
    const finalStatus = PUBLIC_ERROR_MESSAGES[statusCode] ? statusCode : 500;
    super(PUBLIC_ERROR_MESSAGES[finalStatus]);
    this.name = "HttpError";
    this.statusCode = finalStatus;
    this.publicMessage = PUBLIC_ERROR_MESSAGES[finalStatus];
  }
}

export function isHttpError(err: unknown): err is HttpError {
  return err instanceof HttpError;
}
