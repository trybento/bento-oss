import { GraphQLNonNull, GraphQLString } from 'graphql';

import generateEmbedMutation from 'src/graphql/helpers/generateEmbedMutation';

import submitZendeskRequest from '../../../../interactions/integrations/zendesk/submitZendeskRequest';

export default generateEmbedMutation({
  name: 'CreateTicket',
  description: 'Submits a support ticket',
  inputFields: {
    subject: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    ticketId: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    { subject, body, name, email },
    { accountUser, organization }
  ) => {
    await submitZendeskRequest({
      organization,
      accountUser,
      subject,
      body,
      name,
      email,
    });
  },
});
