export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: Record<string, any>) {
    return new AppError(code, message, 400, details);
  }

  static notFound(message: string, code = 'NOT_FOUND', details?: Record<string, any>) {
    return new AppError(code, message, 404, details);
  }

  static unauthorized(message: string, code = 'UNAUTHORIZED', details?: Record<string, any>) {
    return new AppError(code, message, 401, details);
  }

  static forbidden(message: string, code = 'FORBIDDEN', details?: Record<string, any>) {
    return new AppError(code, message, 403, details);
  }
} 