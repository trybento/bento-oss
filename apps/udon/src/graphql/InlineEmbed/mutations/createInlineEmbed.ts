import { GraphQLNonNull } from 'graphql';
import { InlineEmbedInput } from 'bento-common/types';
import EntityIdType from 'bento-common/graphql/EntityId';

import {
  inlineEmbedsChanged,
  onboardingInlineEmbedsChanged,
  templateInlineEmbedChanged,
} from 'src/data/events';
import generateMutation from 'src/graphql/helpers/generateMutation';
import InlineEmbedType from '../InlineEmbed.graphql';
import { default as createInlineEmbedInteraction } from 'src/interactions/inlineEmbeds/createInlineEmbed';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';
import { CreateInlineEmbedInputType } from './common';

type Args = {
  templateEntityId?: string;
  inlineEmbed: Omit<InlineEmbedInput, 'entityId'>;
};

const createInlineEmbed = generateMutation<unknown, Args>({
  name: 'CreateOrganizationInlineEmbed',
  inputFields: {
    templateEntityId: {
      type: EntityIdType,
      description:
        'Entity id of the template whose guides should show in this inline embed',
    },
    inlineEmbed: {
      type: new GraphQLNonNull(CreateInlineEmbedInputType),
    },
  },
  outputFields: {
    inlineEmbed: { type: InlineEmbedType },
  },
  mutateAndGetPayload: async (args, { organization }) => {
    const { templateEntityId } = args;
    const inlineEmbed = await createInlineEmbedInteraction({
      organization,
      templateEntityId,
      inlineEmbed: args.inlineEmbed,
    });

    inlineEmbedsChanged(organization.id);

    if (templateEntityId) {
      templateInlineEmbedChanged(templateEntityId);
    } else {
      onboardingInlineEmbedsChanged(organization.id);
    }

    invalidateLaunchingCacheForOrgAsync(organization, 'createInlineEmbed');

    return { inlineEmbed };
  },
});

export default createInlineEmbed;
