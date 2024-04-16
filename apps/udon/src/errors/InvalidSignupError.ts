import BaseError from './baseError';

export default class InvalidSignupError extends BaseError {
  constructor(error = 'Invalid signup') {
    super(error);
  }
}
