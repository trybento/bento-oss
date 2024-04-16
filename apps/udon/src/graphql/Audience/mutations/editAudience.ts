import { GraphQLNonNull, GraphQLString } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import { GroupTargeting } from 'bento-common/types/targeting';
import { Audience } from 'src/data/models/Audience.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { TemplateTargetsInputType } from 'src/graphql/Template/mutations/setAutoLaunchRulesAndTargetsForTemplate';
import AudienceType from '../Audience.graphql';
import { targetingSegmentToLegacy } from 'src/interactions/targeting/targeting.helpers';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';

type Args = {
  entityId: string;
  name: string;
  targets: GroupTargeting;
};

export default generateMutation<unknown, Args>({
  name: 'EditAudience',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    targets: {
      type: TemplateTargetsInputType,
    },
  },
  outputFields: {
    audience: { type: AudienceType },
  },
  mutateAndGetPayload: async (
    { entityId, name, targets },
    { organization, user }
  ) => {
    const audience = await Audience.findOne({
      where: {
        entityId,
        organizationId: organization.id,
      },
    });

    if (!audience) return { errors: ['Audience not found'] };

    await audience.update({
      name,
      editedAt: new Date(),
      editedByUserId: user.id,
      ...(targets
        ? {
            autoLaunchRules: targetingSegmentToLegacy(
              targets.account,
              'ruleType'
            ),
            targets: targetingSegmentToLegacy(
              targets.accountUser,
              'targetType'
            ),
          }
        : {}),
    });

    if (targets)
      invalidateLaunchingCacheForOrgAsync(
        organization.id,
        'EditAudience mutation'
      );

    await audience.reload();

    return { audience };
  },
});
