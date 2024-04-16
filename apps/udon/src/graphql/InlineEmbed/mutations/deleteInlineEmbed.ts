import EntityIdType, { entityIdField } from 'bento-common/graphql/EntityId';

import {
  templateInlineEmbedChanged,
  onboardingInlineEmbedsChanged,
} from './../../../data/events';
import { inlineEmbedsChanged } from 'src/data/events';
import OrganizationInlineEmbed from 'src/data/models/OrganizationInlineEmbed.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { graphQlError } from 'src/graphql/utils';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';

type Args = {
  entityId: string;
};

const deleteInlineEmbed = generateMutation<unknown, Args>({
  name: 'DeleteOrganizationInlineEmbed',
  inputFields: {
    ...entityIdField(),
  },
  outputFields: {
    inlineEmbedEntityId: { type: EntityIdType },
  },
  mutateAndGetPayload: async (args, { organization }) => {
    const inlineEmbed = await OrganizationInlineEmbed.scope(
      'withOptionalTemplate'
    ).findOne({
      where: {
        entityId: args.entityId,
        organizationId: organization.id,
      },
      attributes: ['id'],
    });

    if (!inlineEmbed) {
      return graphQlError('Inline embed not found');
    }

    const templateEntityId = inlineEmbed.template?.entityId;

    await inlineEmbed.destroy();

    inlineEmbedsChanged(organization.id);

    if (templateEntityId) {
      templateInlineEmbedChanged(templateEntityId);
    } else {
      onboardingInlineEmbedsChanged(organization.id);
    }

    invalidateLaunchingCacheForOrgAsync(organization, 'deleteInlineEmbed');

    return { inlineEmbedEntityId: args.entityId };
  },
});
export default deleteInlineEmbed;
