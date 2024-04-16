import BaseError from './baseError';

export default class SSORequiredError extends BaseError {
  constructor() {
    super('Your organization only allows signing in via Google SSO.');
  }
}
