import promises from 'src/utils/promises';
import { uniqBy } from 'lodash';
import { Op } from 'sequelize';

import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import getUsersCompletedGuideStepBases from './getUsersCompletedGuideStepBase';

export default async function getUsersCompletedAStepInGuideBase(
  guideBaseIds: readonly number[]
) {
  const res: { completed_by_account_user_id: number; guide_base_id: number }[] =
    [];

  await promises.each(guideBaseIds, async (guideBaseId) => {
    const guideStepBases = await GuideStepBase.findAll({
      where: {
        guideBaseId,
        guideModuleBaseId: { [Op.ne]: null } as any,
      },
      attributes: ['id'],
    });

    if (guideStepBases.length === 0) return [];

    const usersCompleted = await getUsersCompletedGuideStepBases(
      guideStepBases.map((gsb) => gsb.id)
    );

    const uniqueUsers = uniqBy(usersCompleted, 'completed_by_account_user_id');

    uniqueUsers.forEach(({ completed_by_account_user_id }) => {
      res.push({
        completed_by_account_user_id,
        guide_base_id: guideBaseId,
      });
    });
  });

  return res;
}
