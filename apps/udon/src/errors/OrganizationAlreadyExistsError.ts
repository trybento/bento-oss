import BaseError from './baseError';

export default class OrganizationAlreadyExistsError extends BaseError {
  constructor(id: number) {
    super(`Organization already exists: ${id}`);
  }
}
