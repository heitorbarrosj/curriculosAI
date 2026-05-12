export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
  }
}

export const asyncHandler =
  <T extends (...args: any[]) => Promise<any>>(fn: T) =>
  (...args: Parameters<T>) =>
    fn(...args).catch(args[2]);
