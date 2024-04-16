import BaseError from './baseError';

export default class GptNoOutputError extends BaseError {
  constructor(error = 'No valid results returned') {
    super(error);
  }
}
