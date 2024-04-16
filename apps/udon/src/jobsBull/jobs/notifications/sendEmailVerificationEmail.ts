import sendEmailVerificationEmail from 'src/interactions/sendEmailVerificationEmail';
import { JobHandler } from 'src/jobsBull/handler';
import { SendEmailVerificationEmailJob } from 'src/jobsBull/job';

const handler: JobHandler<SendEmailVerificationEmailJob> = async (
  job,
  logger
) => {
  const payload = job.data;
  const { email } = payload;

  logger.info('Sending verification email', { email });

  await sendEmailVerificationEmail({
    email,
  });

  logger.info('Sent verification email', { email });
};

export default handler;
