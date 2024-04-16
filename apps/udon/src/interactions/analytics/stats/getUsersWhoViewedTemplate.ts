import promises from 'src/utils/promises';
import { uniqBy } from 'lodash';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { getUsersWhoViewedGuideBasesUsingRollup } from './getUsersWhoViewedGuideBase';
import { createSingleListLoader } from './stats.helpers';

/**
 * Gets list of account users that have viewed requested template Ids
 */
export default async function getUsersWhoViewedTemplates(
  templateIds: readonly number[]
) {
  const res: Array<{ templateId: number; accountUserId: number }> = [];

  // TODO: We can probably skip the each and just get the rows needed from all related gb's
  //   then sort them out after and save us some db pings
  await promises.each(templateIds, async (templateId) => {
    const gbs = await GuideBase.findAll({
      where: {
        createdFromTemplateId: templateId,
      },
      attributes: ['id'],
    });

    const guideBaseParticipants = await getUsersWhoViewedGuideBasesUsingRollup(
      gbs.map((gb) => gb.id)
    );

    const uniqueAccountUsers = uniqBy(guideBaseParticipants, 'accountUserId');

    uniqueAccountUsers.forEach(({ accountUserId }) => {
      res.push({
        templateId,
        accountUserId,
      });
    });
  });

  return res;
}

export const getUsersWhoViewedTemplate = createSingleListLoader(
  getUsersWhoViewedTemplates,
  'templateId'
);
