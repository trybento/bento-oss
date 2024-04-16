import EntityId from 'bento-common/graphql/EntityId';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { Audience } from 'src/data/models/Audience.model';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import generateMutation from 'src/graphql/helpers/generateMutation';
import { graphQlError } from 'src/graphql/utils';
import { formatTargeting } from 'src/interactions/targeting/targeting.helpers';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { logger } from 'src/utils/logger';

export default generateMutation({
  name: 'DeleteAudience',
  inputFields: {
    entityId: {
      type: new GraphQLNonNull(EntityId),
    },
  },
  outputFields: {
    deletedAudienceId: {
      type: GraphQLID,
    },
  },
  mutateAndGetPayload: async ({ entityId }, { organization, user }) => {
    const audience = await Audience.findOne({
      where: {
        entityId,
        organizationId: organization.id,
      },
    });

    if (!audience) return graphQlError('Audience not found');

    const targeting = formatTargeting({
      autoLaunchRules: audience.autoLaunchRules as TemplateAutoLaunchRule[],
      templateTargets: audience.targets as TemplateTarget[],
    });

    const relatedTemplates = await TemplateAudience.findAll({
      where: {
        audienceEntityId: audience.entityId,
        organizationId: organization.id,
      },
      attributes: ['templateId'],
    });

    logger.debug(
      `[deleteAudience] deleting audience, found ${relatedTemplates.length} templates to apply rules to`
    );

    await audience.destroy();

    if (relatedTemplates.length > 0) {
      await queueJob({
        jobType: JobType.ApplyAudienceRulesToTemplate,
        targeting,
        templateIds: relatedTemplates.map((ta) => ta.templateId),
        userId: user.id,
        deleteAudienceId: audience.id,
      });
    } else {
      await queueJob({
        jobType: JobType.DeleteObjects,
        type: 'audience',
        objectIds: [audience.id],
        organizationId: organization.id,
      });
    }

    return { deletedAudienceId: toGlobalId('Audience', entityId) };
  },
});
