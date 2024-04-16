import { GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { pauseGuideBase } from 'src/interactions/launching/pauseGuideBase';
import { GuideBase } from 'src/data/models/GuideBase.model';

export default generateMutation({
  name: 'PauseGuideBase',
  description: 'Pause a guide base from launching to new users',
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

    return { guideBase: await pauseGuideBase(guideBase) };
  },
});
