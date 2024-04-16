import { StatusCodes } from 'http-status-codes';
import BaseError from './baseError';

/**
 * Couldn't find a guide, step, etc.
 */
export default class NoContentError extends BaseError {
  constructor(id: string | number | undefined, contentType: string) {
    super(`No ${contentType} found for '${id}'`);

    this.code = StatusCodes.NOT_FOUND;
  }
}
