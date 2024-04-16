import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql';
import EntityId from 'bento-common/graphql/EntityId';
import generateMutation from 'src/graphql/helpers/generateMutation';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { GraphQLContext } from 'src/graphql/types';
import { Template } from 'src/data/models/Template.model';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import { ResetLevel } from '../../../jobsBull/jobs/guideReset/helpers';
import { toGlobalId } from 'graphql-relay';
import { Op } from 'sequelize';

export default generateMutation({
  name: 'ResetTemplates',
  description: 'Resets the guides for a given list of templates',
  inputFields: {
    templateEntityIds: {
      type: new GraphQLList(new GraphQLNonNull(EntityId)),
    },
  },
  outputFields: {
    resetTemplateIds: {
      type: new GraphQLList(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { templateEntityIds },
    { organization, user }: GraphQLContext
  ) => {
    const templates = await Template.findAll({
      where: {
        entityId: templateEntityIds,
        organizationId: organization.id,
        isTemplate: false,
        [Op.or]: [{ isResetting: null }, { isResetting: false }],
      },
      attributes: ['id', 'entityId'],
    });

    await Template.update(
      {
        isResetting: true,
      },
      {
        where: {
          id: templates.map(({ id }) => id),
        },
      }
    );

    for (const { id } of templates) {
      new AuditContext({
        type: AuditType.Template,
        modelId: id,
        organizationId: organization.id,
        userId: user.id,
      }).logEvent({
        eventName: AuditEvent.reset,
      });

      await queueJob({
        jobType: JobType.ResetGuides,
        resetLevel: ResetLevel.Template,
        resetObjectId: id,
        organizationId: organization.id,
      });
    }

    return {
      resetTemplateIds: templates.map(({ entityId }) =>
        toGlobalId('Template', entityId)
      ),
    };
  },
});
