import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

export default class InvalidLoginError extends BaseError {
  constructor(error = 'Invalid login') {
    super(error);
    this.code = StatusCodes.UNAUTHORIZED;
  }
}
