import BaseError from './baseError';

/** User sent malformed request and should probably consult docs if available */
export default class InvalidPayloadError extends BaseError {
  constructor(message: string) {
    super(`Invalid payload provided: ${message}`);
    this.note = `The data you're passing in is invalid. Please check that all required fields (e.g. user and account IDs) are passed in correctly: ${message}`;
  }
}
