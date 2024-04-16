import BaseError from './baseError';

export default class GptTokenError extends BaseError {
  constructor(error = 'Request exceeds token limit') {
    super(error);
  }
}
