import BaseError from './baseError';

export default class NoAccountError extends BaseError {
  constructor(id?: string, extraMessage?: string) {
    super(`No account: ${id} - ${extraMessage}`);
  }
}
