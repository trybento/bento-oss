import BaseError from './baseError';

export default class UserDeniedError extends BaseError {
  constructor() {
    super('User denied due to email/domain being on deny-list');
  }
}
