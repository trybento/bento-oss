import BaseError from './baseError';

export default class NoAccountUserError extends BaseError {
  constructor(idOrEntityId?: string, extraMessage?: string) {
    let enrichedMessage = '';
    if (idOrEntityId) enrichedMessage = `: ${idOrEntityId}`;
    if (extraMessage) enrichedMessage = `${enrichedMessage} -- ${extraMessage}`;
    super(`No account user${enrichedMessage}`);
  }
}
