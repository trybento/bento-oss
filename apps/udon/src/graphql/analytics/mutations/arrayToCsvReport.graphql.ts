import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { convertArrayToCSV } from 'convert-array-to-csv';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { GraphQLJSONObject } from 'graphql-type-json';
import { sendEmail } from 'src/utils/notifications/sendEmail';
import detachPromise from 'src/utils/detachPromise';
import { createSendgridCsvAttachment } from 'src/utils/notifications/notifications.helpers';

interface Args {
  data: object[];
  subject: string;
  filename: string;
  text?: string;
  html?: string;
}

export default generateMutation({
  name: 'ArrayToCsvReport',
  description:
    'Turn arrays into CSVs to be sent via email. Consider using "generateReportCsvTask" for large datasets.',
  inputFields: {
    data: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLJSONObject))
      ),
    },
    filename: {
      type: new GraphQLNonNull(GraphQLString),
    },
    subject: {
      type: new GraphQLNonNull(GraphQLString),
    },
    text: {
      type: GraphQLString,
    },
    html: {
      type: GraphQLString,
    },
  },
  outputFields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  mutateAndGetPayload: async (
    { data, subject, filename, text, html }: Args,
    { user }
  ) => {
    if (!data) {
      return {
        errors: ['Data not passed'],
      };
    }
    if (!subject) {
      return {
        errors: ['Subject not passed'],
      };
    }
    if (!filename) {
      return {
        errors: ['Filename not passed'],
      };
    }

    detachPromise(async () => {
      const csvString = (await convertArrayToCSV(data)) as string;

      /** @todo potentially leverage email_templates */
      await sendEmail({
        to: user.email,
        subject,
        text: text ?? 'Your report is attached.\n\nSincerely,\nBento',
        html:
          html ?? '<p>Your report is attached.</p><p>Sincerely,<br/>Bento</p>',
        attachments: createSendgridCsvAttachment({
          csvString,
          filename,
        }),
      });
    }, 'array to csv report generation');

    return { success: true };
  },
});
