import BaseError from './baseError';

export default class TimeoutError extends BaseError {
  constructor(url: string, time: number) {
    super(`Timeout error in ${time}ms: to url ${url}`);
  }
}
