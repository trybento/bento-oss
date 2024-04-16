import { AdminRequestMessage, AdminRequests } from 'bento-common/types';

export const createClientKey = (clientString: string) => {
  const uniqueId = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return `${clientString}_${uniqueId}`;
};

/** For rate limiting CSV requests */
export const getRequestRateKey = (messageBody: AdminRequestMessage) => {
  const baseKey = messageBody.organizationEntityId + messageBody.type;
  switch (messageBody.type) {
    case AdminRequests.guideAnswers:
    case AdminRequests.ctaReport:
    case AdminRequests.branchingReport:
      return baseKey + messageBody.templateEntityId;
    case AdminRequests.templateProgress:
      return (
        baseKey + messageBody.templateEntityId + String(messageBody.getSeens)
      );
    default:
      return baseKey;
  }
};
