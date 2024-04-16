import BaseError from './baseError';

export default class EnvError extends BaseError {
  constructor(message: string) {
    super(`Env error: ${message}`);

    this.flag = true;
  }
}
