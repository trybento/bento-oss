import Bluebird from 'bluebird';
import Dataloader from 'dataloader';
import { unzip } from 'lodash';

import { queryRunner } from 'src/data';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Loaders } from '..';

/**
 * WARNING: Should only be used within the context of the Embeddable and a guide that is known to be available
 * since this only considers available tagged elements and filter by the account user, without applying any additional
 * guide/base filters.
 *
 * This now returns all tag elements associated with a guide, regardless of any interaction state
 * (i.e. completion, skipped or saved) and in random order.
 */
export const taggedElementsOfGuideLoader = (_loaders: Loaders) =>
  new Dataloader<
    [accountUserId: number, guideId: number],
    StepTaggedElement[],
    string
  >(
    async (args) => {
      const [accountUserIds, guideIds] = unzip(args) as [number[], number[]];

      const rows = (await queryRunner({
        sql: `--sql
        SELECT
          ste.id as "id",
          gp.account_user_id as "accountUserId",
          ste.guide_id as "guideId"
        FROM
          core.step_tagged_elements ste
          LEFT JOIN core.steps s
            ON s.id = ste.step_id
          JOIN core.guides g
            ON g.id = ste.guide_id
          JOIN core.guide_participants gp
            ON gp.guide_id = g.id
          JOIN core.guide_bases gb
            ON gb.id = g.created_from_guide_base_id
          JOIN core.templates t
            ON t.id = gb.created_from_template_id
        WHERE
          ste.created_from_prototype_id IS NOT NULL -- filter-out "inactive" tags
          AND ste.guide_id IN (:guideIds)
          AND gp.account_user_id IN (:accountUserIds)
        `,
        replacements: {
          accountUserIds,
          guideIds,
        },
      })) as { id: number; accountUserId: number; guideId: number }[];

      const tagIdsByAccountUserIdByGuideId = rows.reduce<
        Record<number, Record<number, number[]>>
      >(
        (acc, row) => ({
          ...acc,
          [row.accountUserId]: {
            ...acc[row.accountUserId],
            [row.guideId]: [
              ...(acc[row.accountUserId]?.[row.guideId] || []),
              row.id,
            ],
          },
        }),
        {}
      );

      return Bluebird.map(args, async ([accountUserId, guideId]) => {
        const tagIds = tagIdsByAccountUserIdByGuideId[accountUserId]?.[guideId];
        return tagIds?.length
          ? StepTaggedElement.findAll({
              where: {
                id: tagIds,
              },
            })
          : [];
      });
    },
    { cacheKeyFn: (keys) => keys.join('-') }
  );

export default taggedElementsOfGuideLoader;
