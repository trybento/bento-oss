import BaseError from './baseError';

export default class InactiveUserError extends BaseError {
  constructor(error = 'User inactive') {
    super(error);
  }
}
