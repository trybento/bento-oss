import { graphql } from 'react-relay';
import fetchQuery, { QueryOptions } from 'queries/fetchQuery';
import { OrgInlineEmbedsQuery } from 'relay-types/OrgInlineEmbedsQuery.graphql';

const commit = (
  props?: QueryOptions & { variables: OrgInlineEmbedsQuery['variables'] }
) => {
  return fetchQuery<
    OrgInlineEmbedsQuery['variables'],
    OrgInlineEmbedsQuery['response']
  >({
    query: graphql`
      query OrgInlineEmbedsQuery {
        inlineEmbeds {
          ...InlineEmbed_inlineEmbedWithTemplate @relay(mask: false)
        }
      }
    `,
    variables: props?.variables || ({} as OrgInlineEmbedsQuery['variables']),
    options: {
      fetchPolicy: props?.fetchPolicy,
    },
    doNotRetain: true,
  });
};

export default commit;
