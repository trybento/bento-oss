import BaseError from './baseError';

export default class NoUserError extends BaseError {
  constructor(id?: string, extraMessage?: string) {
    super(`No user: ${id} - ${extraMessage}`);
  }
}
