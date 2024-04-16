import {
  TemplateProgressRequest,
  StepProgressRequest,
  AdminRequests,
} from 'bento-common/types';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import handleAdminRequest from 'src/interactions/reporting/handleAdminRequest';
import { JobHandler } from 'src/jobsBull/handler';
import { GenerateReportCsvJob } from 'src/jobsBull/job';
import { createSendgridCsvAttachment } from 'src/utils/notifications/notifications.helpers';
import { sendEmail } from 'src/utils/notifications/sendEmail';

const typeEmailSubjects = {
  [AdminRequests.guideAnswers]: 'Bento guide input answers report for %s',
  [AdminRequests.stepProgressRequest]: 'Bento step progress report for %s',
  [AdminRequests.templateProgress]: 'Bento guide progress report for %s',
  [AdminRequests.ctaReport]: 'Bento user action report for %s',
  [AdminRequests.branchingReport]: 'Bento branching selection report for %s',
};

function getSubject(payload: GenerateReportCsvJob, template?: Template) {
  const subjectBaseString = typeEmailSubjects[payload.type];
  if ((payload as StepProgressRequest).dateOptions) {
    const start = new Date(
      (payload as StepProgressRequest).dateOptions.start
    ).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const end = new Date(
      (payload as StepProgressRequest).dateOptions.end
    ).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return subjectBaseString.replace('%s', `${start} to ${end}`);
  } else if ((payload as TemplateProgressRequest).templateEntityId) {
    return subjectBaseString.replace(
      '%s',
      `"${
        template?.name || (payload as TemplateProgressRequest).templateEntityId
      }"`
    );
  }
}

/** Create a dump for template step reports */
const generateReportCsvTask: JobHandler<GenerateReportCsvJob> = async (
  job,
  logger
) => {
  const payload = job.data;
  const organization = await Organization.findOne({
    where: { entityId: payload.organizationEntityId },
  });

  if (!organization) {
    logger.warn(
      `[generateReportCsv] organization not found: ${
        (payload as TemplateProgressRequest).organizationEntityId
      }`
    );
    return;
  }

  const template = ((payload as TemplateProgressRequest).templateEntityId &&
    (await Template.findOne({
      where: {
        entityId: (payload as TemplateProgressRequest).templateEntityId,
      },
    }))) as Template | undefined;

  if ((payload as TemplateProgressRequest).templateEntityId && !template) {
    logger.warn(
      `[generateReportCsv] template not found: ${
        (payload as TemplateProgressRequest).templateEntityId
      }`
    );
    return;
  }

  const data = await new Promise<string>((resolve) =>
    // @ts-ignore
    handleAdminRequest({ message: payload, organization, sendMessage: resolve })
  );

  /** @todo potentially leverage email_templates */
  await sendEmail({
    to: payload.requesterEmail,
    subject: getSubject(payload, template),
    text: 'Your report is attached.\n\nSincerely,\nBento',
    html: '<p>Your report is attached.</p><p>Sincerely,<br/>Bento</p>',
    attachments: createSendgridCsvAttachment({
      csvString: data,
      filename: payload.filename,
    }),
  });
};

export default generateReportCsvTask;
