import BaseError from './baseError';

export default class DataLoaderError extends BaseError {
  constructor(
    /** The data loader method or operation name */
    name: string
  ) {
    super(`${name} failed to load data`);
  }
}
