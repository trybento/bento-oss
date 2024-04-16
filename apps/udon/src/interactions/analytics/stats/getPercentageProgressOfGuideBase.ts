import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import getPercentageUsersCompletedGuideStepBases from './getPercentageUsersCompletedGuideStepBase';

/** Average percentage of steps completed  */
export default async function getPercentageProgressOfGuideBase(
  guideBaseIds: readonly number[]
) {
  return promises.mapSeries(guideBaseIds, async (guideBaseId) => {
    const guideStepBases = await GuideStepBase.findAll({
      where: {
        guideBaseId,
        guideModuleBaseId: { [Op.ne]: null } as any,
      },
      attributes: ['id'],
    });

    if (guideStepBases.length === 0) return 0;

    const allStepPercentages = await getPercentageUsersCompletedGuideStepBases(
      guideStepBases.map((gsb) => gsb.id)
    );

    if (allStepPercentages.length === 0) return 0;

    return Math.round(
      allStepPercentages.reduce((a, b) => a + b, 0) / allStepPercentages.length
    );
  });
}
