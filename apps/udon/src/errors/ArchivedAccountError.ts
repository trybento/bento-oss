import BaseError from './baseError';

export default class ArchivedAccountError extends BaseError {
  constructor(id?: string) {
    super(`Account archived: ${id}`);
    this.note = `The account you're trying to identify has been archived by one of your colleagues via the Bento admin UI`;
  }
}
