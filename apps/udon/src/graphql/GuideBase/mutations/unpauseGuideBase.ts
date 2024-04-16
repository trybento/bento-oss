import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { unpauseGuideBase } from 'src/interactions/unpauseGuideBase';
import { GuideBase } from 'src/data/models/GuideBase.model';

export default generateMutation({
  name: 'UnpauseGuideBase',
  description: 'Unpause a guide base for launching to new users',
  inputFields: {
    guideBaseEntityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    guideBase: {
      type: GuideBaseType,
    },
  },
  mutateAndGetPayload: async ({ guideBaseEntityId }, { organization }) => {
    const guideBase = await GuideBase.findOne({
      where: {
        entityId: guideBaseEntityId,
        organizationId: organization.id,
      },
    });

    if (!guideBase) {
      return { errors: ['Guide base not found'] };
    }

    return { guideBase: await unpauseGuideBase(guideBase) };
  },
});
