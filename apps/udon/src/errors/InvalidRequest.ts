import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

export default class InvalidRequestError extends BaseError {
  constructor(message: string) {
    super(`Invalid request: ${message}`);

    this.code = StatusCodes.BAD_REQUEST;
  }
}
