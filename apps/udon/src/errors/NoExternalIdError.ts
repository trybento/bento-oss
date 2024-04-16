import BaseError from './baseError';

export default class NoExternalIdError extends BaseError {
  constructor(missing: 'groupId' | 'userId' | 'accountId' = 'userId') {
    super(`No ${missing} provided`);
  }
}
