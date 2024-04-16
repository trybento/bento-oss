import { triggerAvailableGuidesChangedForGuideBases } from 'src/data/eventUtils';
import { GraphQLInt, GraphQLNonNull } from 'graphql';

import EntityId from 'bento-common/graphql/EntityId';
import GuideBaseType from 'src/graphql/GuideBase/GuideBase.graphql';
import { launchGuideBase } from 'src/interactions/launching/launchGuideBase';
import generateMutation from 'src/graphql/helpers/generateMutation';

import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { invalidateLaunchingCacheForOrgAsync } from 'src/interactions/caching/identifyChecksCache';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import markTargetingSetForTemplate from 'src/interactions/targeting/markTargetingSetForTemplate';

export default generateMutation({
  name: 'LaunchGuideBase',
  description: 'Launch an existing guide base',
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
  mutateAndGetPayload: async (
    { guideBaseEntityId },
    { organization, user }
  ) => {
    const guideBase = await GuideBase.findOne({
      where: {
        entityId: guideBaseEntityId,
        organizationId: organization.id,
      },
      include: [
        {
          model: Template,
          required: true,
        },
      ],
    });

    if (!guideBase) {
      return {
        errors: ['Guide base not found'],
      };
    }

    await launchGuideBase({
      guideBase,
    });

    new AuditContext({
      type: AuditType.Template,
      modelId: guideBase.createdFromTemplateId!,
      organizationId: organization.id,
      userId: user.id,
    }).logEvent({
      eventName: AuditEvent.manualLaunch,
      data: {
        accountId: guideBase.accountId,
      },
    });

    await markTargetingSetForTemplate({
      template: guideBase.createdFromTemplate!,
    });

    triggerAvailableGuidesChangedForGuideBases([guideBase]);

    /**
     * invalidates the org cache
     * @todo invalidate cache at the account level
     */
    invalidateLaunchingCacheForOrgAsync(organization, 'launchGuideBase');

    return { guideBase };
  },
});
