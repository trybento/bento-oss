import { GuideTypeEnum } from 'bento-common/types';

import promises from 'src/utils/promises';
import { Guide } from 'src/data/models/Guide.model';
import { Step } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import { createSingleLoader } from './stats.helpers';

/**
 * Get completion percentage while being mindful of guide type
 */
export default async function getPercentageUsersCompletedGuideStepBases(
  guideStepBaseIds: readonly number[]
) {
  return promises.mapSeries(guideStepBaseIds, async (guideStepBaseId) => {
    const steps = await Step.findAll({
      where: {
        createdFromGuideStepBaseId: guideStepBaseId,
      },
      attributes: ['id', 'completedAt'],
      include: [
        {
          required: true,
          model: Guide,
          attributes: ['id'],
          include: [
            {
              required: true,
              model: Template,
              attributes: ['type'],
            },
          ],
        },
      ],
    });

    if (steps.length === 0) return 0;

    const belongsToGuideType = steps[0].guide.createdFromTemplate!.type;

    if (belongsToGuideType === GuideTypeEnum.user) {
      const total = steps.length;
      const countCompleted = steps.filter(
        (step: Step) => !!step.completedAt
      ).length;

      return +((countCompleted / total) * 100).toFixed(2);
    } else {
      /* We expect only one copy of the step, but in some cases (legacy) there may be more */
      return steps.some((s) => !!s.completedAt) ? 100 : 0;
    }
  });
}

export const getPercentageUsersCompletedGuideStepBase = createSingleLoader(
  getPercentageUsersCompletedGuideStepBases
);
