import BaseError from './baseError';

export default class DataMutatorError extends BaseError {
  constructor(
    /** The data mutator method or operation name */
    name: string
  ) {
    super(`${name} failed to mutate data`);
  }
}
