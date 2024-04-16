import { sendForgotPasswordLinkEmail } from 'src/interactions/sendForgotPasswordLinkEmail';
import {
  AuthAudit,
  AuthAuditEvent,
  AuthAuditEventOutcome,
} from 'src/data/models/Audit/AuthAudit.model';
import { JobHandler } from 'src/jobsBull/handler';
import { SendForgotPasswordLinkEmailJob } from 'src/jobsBull/job';

const handler: JobHandler<SendForgotPasswordLinkEmailJob> = async (
  job,
  logger
) => {
  const { email, originRequestId } = job.data;

  logger.debug(
    '[sendForgotPasswordLinkEmailTask] Sending forgot password link email'
  );

  const success = await sendForgotPasswordLinkEmail({
    email,
  });

  await AuthAudit.create(
    {
      eventName: AuthAuditEvent.sendResetPasswordEmail,
      meta: { originRequestId },
      payload: { email },
      outcome: success
        ? AuthAuditEventOutcome.success
        : AuthAuditEventOutcome.failure,
    },
    { returning: false }
  );

  logger.info('Sent forgot password email', { email });
};

export default handler;
