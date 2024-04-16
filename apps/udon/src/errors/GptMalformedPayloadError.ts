import BaseError from './baseError';

export default class GptMalformedPayloadError extends BaseError {
  constructor(error = 'No valid results returned') {
    super(error);
  }
}
