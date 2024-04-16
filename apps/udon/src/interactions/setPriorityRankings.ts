import { Model } from 'sequelize';
import { AuditEvent, RankableType } from 'bento-common/types';

import promises from 'src/utils/promises';
import { withTransaction } from 'src/data';
import NpsSurvey from 'src/data/models/NetPromoterScore/NpsSurvey.model';
import { Template } from 'src/data/models/Template.model';
import { User } from 'src/data/models/User.model';
import AuditContext, { AuditType } from 'src/utils/auditContext';

type Args = {
  targets: {
    entityId: string;
    priorityRanking: number;
    type: RankableType;
  }[];
  organizationId: number;
  user: User;
};

const fieldsToFetch = ['id', 'entityId', 'priorityRanking'];

/**
 * Updates the priority ranking for all rankable objects.
 * Skips update if there is no difference in ranking.
 */
export async function setPriorityRanking({
  targets,
  organizationId,
  user,
}: Args) {
  return withTransaction(async () => {
    const {
      priorityRankingsByTargetEntityId,
      templateEntityIds,
      surveyEntityIds,
    } = targets.reduce(
      (acc, t) => {
        acc.priorityRankingsByTargetEntityId[t.entityId] = t;
        if (t.type === RankableType.guide)
          acc.templateEntityIds.push(t.entityId);
        if (t.type === RankableType.survey)
          acc.surveyEntityIds.push(t.entityId);
        return acc;
      },
      {
        priorityRankingsByTargetEntityId: {} as Record<
          string,
          Args['targets'][number]
        >,
        templateEntityIds: [] as string[],
        surveyEntityIds: [] as string[],
      }
    );

    const templates = await Template.findAll({
      attributes: fieldsToFetch,
      where: {
        entityId: templateEntityIds as string[],
        organizationId,
      },
    });

    const surveys = await NpsSurvey.findAll({
      attributes: fieldsToFetch,
      where: {
        entityId: surveyEntityIds as string[],
        organizationId,
      },
    });

    await promises.each([...templates, ...surveys], async (target) => {
      const targetData = priorityRankingsByTargetEntityId[target.entityId];

      /**
       * Do not hit the database if:
       * - targetData is undefined, perhaps due to the element being deleted.
       * - The rank remains unchanged.
       */
      if (!targetData || targetData.priorityRanking === target.priorityRanking)
        return;

      /**
       * We have to coerce Typescript into "knowing" what type of
       * instance we're updating, as otherwise a type error is thrown
       * due to non-overlapping creation attribute typings.
       */
      (target as Model).set({
        priorityRanking: targetData.priorityRanking,
      });

      /**
       * NPS doesn't have audit
       */
      if (target instanceof Template)
        new AuditContext({
          type: AuditType.Template,
          modelId: target.id,
          organizationId,
          userId: user.id,
        }).logEvent({
          eventName: AuditEvent.priorityChanged,
          data: {
            previousPriority: target.priorityRanking,
            newPriority: targetData.priorityRanking,
          },
        });

      await target.save();

      return;
    });

    return;
  });
}
