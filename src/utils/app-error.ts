import { HttpStatus } from '../config/constants';

export class AppError extends Error {
  constructor(
    public override readonly message: string,
    public readonly _code: HttpStatus = HttpStatus._INTERNAL_ERROR
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
