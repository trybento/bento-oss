import BaseError from './baseError';

export default class UnableToRedirectError extends BaseError {
  constructor(redirectUrl: string | null | undefined) {
    super(`Unable to redirect to URL: ${redirectUrl}`);
  }
}
