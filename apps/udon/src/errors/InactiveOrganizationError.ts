import BaseError from './baseError';

export default class InactiveOrganizationError extends BaseError {
  constructor(_orgOrAppId: string) {
    super(`Organization is inactive: ${_orgOrAppId}`);
    this.note = `Your org is currently inactive, so requests will fail. Please contact [support@trybento.co](mailto:support@trybento.co) if you’d like to request a new trial.`;
  }
}
