import { MailDataRequired } from '@sendgrid/mail';
import { SUPPORT_ADDRESS } from '../constants';
import { logger } from '../logger';
import { sendEmail } from './sendEmail';

const INTERNAL_EMAIL_RECIPIENT = process.env.TEST_EMAIL || SUPPORT_ADDRESS;

/**
 * Build a certain format/destination for internal alerting
 * Don't let any send errors affect the outside oeprations
 */
export const sendInternalEmail = async ({
  email,
  subject,
  html,
  text,
  title,
}: {
  email?: string;
  subject: string;
  title?: string;
  html: string;
  text: string;
}) => {
  const _html = `
		<h1>${title || subject}</h1>
		<h3>${text}</h3>
		<div>
			${html}
		</div>
	`;

  try {
    await sendEmail({
      to: email || INTERNAL_EMAIL_RECIPIENT,
      html: _html,
      subject,
      text,
    });
  } catch (e: any) {
    logger.error(
      `[sendInternalEmail] Error sending internal email ${e.message}`,
      e
    );
  }
};

/**
 * Transform CSV string into a sendgrid CSV attachment
 * Fill add ".csv" extension to filename if missing
 */
export const createSendgridCsvAttachment = ({
  csvString,
  filename,
}: {
  csvString: string;
  filename: string;
}): MailDataRequired['attachments'] => {
  const formattedFilename = filename.endsWith('.csv')
    ? filename
    : filename + '.csv';

  return [
    {
      content: Buffer.from(csvString).toString('base64'),
      filename: formattedFilename,
      type: 'text/csv',
      disposition: 'attachment',
    },
  ];
};
