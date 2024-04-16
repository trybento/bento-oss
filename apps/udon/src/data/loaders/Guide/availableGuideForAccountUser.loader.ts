import Dataloader from 'dataloader';
import { unzip } from 'lodash';
import { Op } from 'sequelize';

import { Guide, GuideScope } from 'src/data/models/Guide.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

/**
 * Specialized to prevent over-fetching
 *
 * We need to be diligent that this matches availableGuidesForAccountUserLoader's selections
 *   relatively well, because otherwise the bulk loader will tell the embed to ask for guides
 *   that we can't get full information on, or this query asks for guides where the source
 *   objects are dropped, etc.
 */
const availableGuideForAccountUserLoader = () =>
  new Dataloader<
    [accountUserId: number, guideEntityId: string],
    Guide | null,
    string
  >(
    async (args) => {
      const [accountUserIds, guideEntityIds] = unzip(args) as [
        number[],
        string[]
      ];

      const guides = await Guide.scope([
        GuideScope.launched,
        GuideScope.active,
      ]).findAll({
        where: {
          entityId: {
            [Op.in]: guideEntityIds,
          },
        },
        include: [
          {
            model: GuideParticipant.scope('notObsolete'),
            attributes: ['accountUserId'],
            required: true,
            where: {
              accountUserId: {
                [Op.in]: accountUserIds,
              },
            },
          },
        ],
      });

      const guidesByAccountUserByEntityId = guides.reduce<
        Record<number, Record<string, Guide>>
      >((acc, guide) => {
        guide.guideParticipants.forEach((gp) => {
          acc[gp.accountUserId] = {
            ...acc[gp.accountUserId],
            [guide.entityId]: guide,
          };
        });
        return acc;
      }, {});

      return args.map(
        ([accountUserId, guideEntityId]) =>
          guidesByAccountUserByEntityId[accountUserId]?.[guideEntityId] || null
      );
    },
    { cacheKeyFn: (key) => key.join('-') }
  );

export default availableGuideForAccountUserLoader;
