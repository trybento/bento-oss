import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

export default class RateLimitError extends BaseError {
  constructor(retryTime?: number) {
    super(
      `API Rate limit exceeded ${retryTime ? `Retry in ${retryTime}ms` : ''}`
    );

    this.code = StatusCodes.TOO_MANY_REQUESTS;
  }
}
