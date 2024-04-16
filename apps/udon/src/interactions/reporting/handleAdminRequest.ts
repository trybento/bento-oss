import { AdminRequestMessage, AdminRequests } from 'bento-common/types';

import { Organization } from 'src/data/models/Organization.model';
import detachPromise from 'src/utils/detachPromise';
import { handleUploadedUserAttributes } from '../dataOperations/handleUploadedUserAttributes';
import generateBranchingReport from './generateBranchingReport';
import generateCtaReport from './generateCtaReport';
import generateGuideAnswersReport from './generateGuideAnswersReport';
import generateStepProgress from './generateStepProgress';

type Args = {
  message: AdminRequestMessage;
  organization: Organization;
  // TODO: serialize/deserialize json so we can send better states/results
  sendMessage: (data: string | number) => void;
};

/** @todo: add explicit error handling instead of using normal success */
export default function handleAdminRequest({
  message,
  organization,
  sendMessage,
}: Args) {
  const sendError = (msg: string) => sendMessage(`Error: ${msg}`);

  switch (message.type) {
    case AdminRequests.stepProgressRequest:
      const dates =
        message.dateOptions.start && message.dateOptions.end
          ? {
              start: message.dateOptions.start,
              end: message.dateOptions.end,
            }
          : undefined;

      detachPromise(
        () =>
          generateStepProgress({
            organization,
            dates,
          }),
        'generate step progress report',
        {
          onSuccess: (data) => sendMessage(data),
          onError: (err) => sendError(err.message),
        }
      );
      break;
    case AdminRequests.uploadUserAttributes:
      const csvString = message.data;
      const { attributeName, attributeType, defaultAttributeValue } = message;

      detachPromise(
        () =>
          handleUploadedUserAttributes({
            csvString,
            attributeName,
            attributeType,
            organization,
            defaultAttributeValue,
          }),
        'upload user attribute csv',
        {
          onSuccess: (affected) => sendMessage(affected),
          onError: (err) => sendError(err.message),
        }
      );
      break;
    case AdminRequests.templateProgress: {
      const { templateEntityId, getSeens = false } = message;

      detachPromise(
        () =>
          generateStepProgress({
            organization,
            templateEntityId,
            getSeens,
          }),
        'generate step progress report',
        {
          onSuccess: (data) => sendMessage(data),
          onError: (err) => sendError(err.message),
        }
      );

      break;
    }
    case AdminRequests.ctaReport: {
      const { templateEntityId } = message;

      detachPromise(
        () =>
          generateCtaReport({
            organization,
            templateEntityId,
          }),
        'generate cta report',
        {
          onSuccess: (data) => sendMessage(data),
          onError: (err) => sendError(err.message),
        }
      );

      break;
    }
    case AdminRequests.guideAnswers:
      const { templateEntityId } = message;

      detachPromise(
        () =>
          generateGuideAnswersReport({
            organization,
            templateEntityId,
          }),
        'generate answers report',
        {
          onSuccess: (data) => sendMessage(data),
          onError: (err) => sendError(err.message),
        }
      );

      break;
    case AdminRequests.branchingReport: {
      const { templateEntityId } = message;

      detachPromise(
        () =>
          generateBranchingReport({
            organization,
            templateEntityId,
          }),
        'generate branching report',
        {
          onSuccess: (data) => sendMessage(data),
          onError: (err) => sendError(err.message),
        }
      );
      break;
    }
    default:
      throw new Error('Unsupported admin action');
  }
}
