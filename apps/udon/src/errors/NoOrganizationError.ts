import BaseError from './baseError';

export default class NoOrganizationError extends BaseError {
  constructor(id?: string | number) {
    super(`No organization: ${id}`);
    this.note = `The appID you're using is not associated with any known org in Bento. Please make sure you've copied the correct appID which can be found in the Integrations tab in Bento.`;
  }
}
