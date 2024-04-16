import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

export default class InvalidAuthPayloadError extends BaseError {
  constructor(error = 'Invalid auth payload') {
    super(error);

    this.code = StatusCodes.UNAUTHORIZED;
  }
}
