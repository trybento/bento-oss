import { JobHandler } from 'src/jobsBull/handler';
import { SendEmailJob } from 'src/jobsBull/job';
import { sendEmail as sendEmailViaSendGrid } from '../../../utils/notifications/sendEmail';

const handler: JobHandler<SendEmailJob> = async (job, logger) => {
  const payload = job.data;
  const { to, from, subject, text, html, asm } = payload;
  logger.info('Sending email', { to, subject });

  try {
    await sendEmailViaSendGrid({
      to,
      from,
      subject,
      text,
      html,
      asm,
    });
    logger.info('Sent email', { to, subject });
  } catch (e: any) {
    e.to = to;
    e.subject = subject;
    throw e;
  }
};

export default handler;
