// minimal base error class heavily inspired on typed-error
// @link https://github.com/balena-io-modules/typed-error

export default class BaseError extends Error {
  public name: string;
  public message: string;
  public stack = '';
  public cause?: Error;

  constructor(error: Error | string) {
    super();

    if (error instanceof Error) {
      this.message = `[BENTO] ${error.message}`;
    } else {
      this.message = `[BENTO] ${error}`;
    }

    this.name = this.constructor.name;
    /**
     * Prevents a fatal error when `Error.captureStackTrace` is not available
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#static_methods
     */
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
