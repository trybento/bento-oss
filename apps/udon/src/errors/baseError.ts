// minimal base error class heavily inspired on typed-error
// @link https://github.com/balena-io-modules/typed-error

import { StatusCodes } from 'http-status-codes';

export default class BaseError extends Error {
  public name: string;
  public message: string;
  public stack = '';
  public code: StatusCodes = StatusCodes.BAD_REQUEST;
  /**
   * Whether or not we should "flag" this error.
   *   e.g. if i's a system error we need to log/send to Sentry, vs. a user error
   */
  public flag = false;
  /**
   * Note with additional context/instructions we can use to send back to users
   *   as an error message.
   */
  public note: string;

  constructor(error: Error | string) {
    super();

    if (error instanceof Error) {
      this.message = error.message;
    } else {
      this.message = error;
    }

    this.note = this.message;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
