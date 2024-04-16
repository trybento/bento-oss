import sendGrid, { MailDataRequired } from '@sendgrid/mail';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { NOTIFICATIONS_ADDRESS } from '../constants';
import { logger } from '../logger';

const SENDGRID_API_KEY: string | undefined = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sendGrid.setApiKey(SENDGRID_API_KEY);
}

const isApiKeySet = !!SENDGRID_API_KEY;
export interface MessageConfig {
  to: string | { name: string; email: string };
  cc?: string;
  from?: string | { name: string; email: string };
  subject: string;
  text: string;
  html: string;
  asm?: {
    groupId: number;
    groupsToDisplay: number[];
  };
  attachments?: MailDataRequired['attachments'];
}

const DEFAULT_FROM = {
  name: 'Bento Onboarding',
  email: NOTIFICATIONS_ADDRESS,
};

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  asm,
  attachments,
  cc,
}: MessageConfig) {
  if (!isApiKeySet) {
    logger.warn('No API key set. Message not sent.');
    logger.debug(text);
    return;
  }

  await sendGrid.send({
    to,
    cc,
    from: from || DEFAULT_FROM,
    subject,
    text,
    html,
    asm,
    attachments,
  });

  logger.debug('Email sent');
}

export async function sendEmailAsync({
  to,
  from,
  subject,
  text,
  html,
  asm,
}: MessageConfig) {
  await queueJob({
    jobType: JobType.SendEmail,
    to,
    from,
    subject,
    text,
    html,
    asm,
  });
}
