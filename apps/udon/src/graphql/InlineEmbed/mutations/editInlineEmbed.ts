import { InlineEmbedInput, WithRequiredPicks } from 'bento-common/types';

import generateMutation from 'src/graphql/helpers/generateMutation';
import {
  inlineEmbedsChanged,
  templateInlineEmbedChanged,
} from 'src/data/events';
import { graphQlError } from 'src/graphql/utils';
import upsertInlineEmbed from 'src/interactions/inlineEmbeds/upsertInlineEmbed';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import { onboardingInlineEmbedsChanged } from 'src/data/events';
import { EditInlineEmbedInputType } from './common';
import InlineEmbedType from '../InlineEmbed.graphql';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';

type Args = WithRequiredPicks<InlineEmbedInput, 'entityId'>;

const editInlineEmbed = generateMutation<unknown, Args>({
  name: 'EditOrganizationInlineEmbed',
  inputFields: EditInlineEmbedInputType.getFields(),
  outputFields: {
    inlineEmbed: { type: InlineEmbedType },
  },
  mutateAndGetPayload: async (args, { organization }) => {
    const inlineEmbed = await OrganizationInlineEmbed.scope(
      'withOptionalTemplate'
    ).findOne({
      where: {
        entityId: args.entityId,
        organizationId: organization.id,
      },
    });

    if (!inlineEmbed) {
      return graphQlError('Inline embed not found');
    }

    const [updatedInlineEmbed] = await upsertInlineEmbed({
      organization,
      inlineEmbed: args,
    });

    inlineEmbedsChanged(organization.id);

    if (inlineEmbed.template) {
      templateInlineEmbedChanged(inlineEmbed.template.entityId);
    } else {
      onboardingInlineEmbedsChanged(organization.id);
    }

    invalidateLaunchingCacheForOrgAsync(organization, 'editInlineEmbed');

    return { inlineEmbed: updatedInlineEmbed };
  },
});

export default editInlineEmbed;
