import { AdminRequests } from 'bento-common/types';
import { sanitizeForFilename } from 'bento-common/utils/strings';
import { format } from 'date-fns';

import { sendReportGenerationRequest } from 'utils/sendAdminRequest';

/** Required to validate the request and update */
type BaseAdminRequestArgs = {
  organizationEntityId: string;
  accessToken?: string;
  onSuccess?: () => void;
  onError?: (e: any) => void;
};

type RequestStepProgressArgs = BaseAdminRequestArgs & {
  dates?: Date[];
};

/* There's probably a line of best fit equation, but simpler like this */
const steps = [
  1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
];

export const getTickSize = (n: number) => {
  let useStep = 1;
  for (let i = 0; i < steps.length; i++) {
    if (n > steps[i]) useStep = 0.1 * steps[i + 1];
    else break;
  }
  return useStep;
};

export const csvSuccessMsg =
  "CSV requested! This may take a few minutes. You'll receive an email when it's ready.";

export function requestStepProgressCsv({
  accessToken,
  organizationEntityId,
  dates,
}: RequestStepProgressArgs) {
  const start = dates[0]?.toISOString().split('T')[0];
  const end = dates[1]?.toISOString().split('T')[0];

  return sendReportGenerationRequest({
    accessToken,
    payload: {
      type: AdminRequests.stepProgressRequest,
      organizationEntityId,
      filename: `BentoStepProgress_${start}-${end}.csv`,
      dateOptions: { start, end },
    },
  });
}

type RequestTemplateProgressArgs = BaseAdminRequestArgs & {
  templateEntityId: string;
  templateName: string;
  getSeens?: boolean;
};

export function requestTemplateProgressCsv({
  accessToken,
  organizationEntityId,
  templateEntityId,
  templateName,
  getSeens,
}: RequestTemplateProgressArgs) {
  const date = new Date();
  return sendReportGenerationRequest({
    accessToken,
    payload: {
      type: AdminRequests.templateProgress,
      organizationEntityId,
      templateEntityId,
      getSeens,
      filename: `Bento_${sanitizeForFilename(templateName)}_${
        getSeens ? 'views' : 'progress'
      }_${format(date, 'yyy-MM-dd')}.csv`,
    },
  });
}

type RequestGuideAnswersArgs = BaseAdminRequestArgs & {
  templateEntityId: string;
  templateName: string;
  onRequested?: () => void;
};

export const requestGuideAnswersCsv = async ({
  organizationEntityId,
  templateEntityId,
  templateName,
  accessToken,
}: RequestGuideAnswersArgs) => {
  const date = new Date();

  return sendReportGenerationRequest({
    accessToken,
    payload: {
      type: AdminRequests.guideAnswers,
      organizationEntityId,
      templateEntityId,
      filename: `Bento_${sanitizeForFilename(templateName)}_answers_${format(
        date,
        'yyy-MM-dd'
      )}.csv`,
    },
  });
};

type RequestCtaCsvArgs = BaseAdminRequestArgs & {
  templateEntityId: string;
  templateName: string;
};

export const requestCtaCsv = async ({
  organizationEntityId,
  templateEntityId,
  accessToken,
  templateName,
}: RequestCtaCsvArgs) => {
  const date = new Date();

  return sendReportGenerationRequest({
    accessToken,
    payload: {
      type: AdminRequests.ctaReport,
      organizationEntityId,
      templateEntityId,
      filename: `Bento_${sanitizeForFilename(templateName)}_ctas_${format(
        date,
        'yyy-MM-dd'
      )}.csv`,
    },
  });
};

/**
 *
 * @todo Centralize with the above
 */
export const requestBranchingCsv = async ({
  organizationEntityId,
  templateEntityId,
  accessToken,
  templateName,
}: RequestCtaCsvArgs) => {
  const date = new Date();

  return sendReportGenerationRequest({
    accessToken,
    payload: {
      type: AdminRequests.branchingReport,
      organizationEntityId,
      templateEntityId,
      filename: `Bento_${sanitizeForFilename(templateName)}_branching_${format(
        date,
        'yyy-MM-dd'
      )}.csv`,
    },
  });
};
