import { keyBy } from 'lodash';
import Dataloader from 'dataloader';
import { StepType } from 'bento-common/types';

import { Loaders } from 'src/data/loaders';
import promises from 'src/utils/promises';
import { queryRunner } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { BranchingBranch } from 'src/data/models/types';

export type GuideStepBaseBranchingInfo = {
  choiceLabel: string | null;
  choiceKey: string | null;
  usersSelected: AccountUser[];
};

/**
 * Returns the branching info for the given GuideStepBase instances.
 *
 * WARNING: This won't scale for high-traffic templates since we could be loading
 * thousands of branching selections and account user data at once.
 *
 * @todo unit test
 *
 * @promise {@link GuideStepBaseBranchingInfo}[]
 */
export default function branchingInfoOfGuideStepBaseLoader(loaders: Loaders) {
  return new Dataloader<string, GuideStepBaseBranchingInfo[]>(
    async (gsbEntityIds) => {
      const choicesRows = (await queryRunner({
        sql: `--sql
          SELECT
            gsb.entity_id AS "guideStepBaseEntityId",
            sp.branching_choices AS "branches"
          FROM
            core.guide_step_bases gsb
					JOIN core.step_prototypes sp ON sp.id = gsb.created_from_step_prototype_id
          WHERE
            sp.step_type IN (:branchingStepTypes)
            AND sp.branching_choices IS NOT NULL
            AND gsb.entity_id IN (:gsbEntityIds)
						AND gsb.deleted_at IS NULL;
        `,
        replacements: {
          branchingStepTypes: [StepType.branching, StepType.branchingOptional],
          gsbEntityIds,
        },
      })) as {
        guideStepBaseEntityId: string;
        branches: BranchingBranch[];
      }[];

      const choicesByGsbEntityId = keyBy(choicesRows, 'guideStepBaseEntityId');

      const selectionRows = (await queryRunner({
        sql: `--sql
          SELECT DISTINCT
            gsb.entity_id AS "guideStepBaseEntityId",
            au.id AS "accountUserId",
            bp.choice_key AS "choiceKey"
          FROM
            core.triggered_branching_paths tbp
            JOIN core.account_users au ON tbp.account_user_id = au.id
            JOIN core.branching_paths bp ON tbp.branching_path_id = bp.id
            JOIN core.steps s ON tbp.triggered_from_step_id = s.id
            JOIN core.guide_step_bases gsb ON gsb.id = s.created_from_guide_step_base_id
            JOIN core.step_prototypes sp ON sp.id = gsb.created_from_step_prototype_id
          WHERE
            sp.step_type IN (:branchingStepTypes)
            AND sp.branching_choices IS NOT NULL
            AND gsb.entity_id IN (:gsbEntityIds);
        `,
        replacements: {
          branchingStepTypes: [StepType.branching, StepType.branchingOptional],
          gsbEntityIds,
        },
      })) as {
        guideStepBaseEntityId: string;
        accountUserId: number;
        choiceKey: string;
      }[];

      const auIds: number[] = [];

      const auIdsByGsbEntityIdGroupedByChoiceKey = selectionRows.reduce<
        Record<string, Record<string, number[]>>
      >((acc, row) => {
        const { guideStepBaseEntityId, choiceKey } = row;
        if (!acc[guideStepBaseEntityId]) acc[guideStepBaseEntityId] = {};
        if (!acc[guideStepBaseEntityId][choiceKey]) {
          acc[guideStepBaseEntityId][choiceKey] = [];
        }
        acc[guideStepBaseEntityId][choiceKey].push(row.accountUserId);
        auIds.push(row.accountUserId);
        return acc;
      }, {});

      const accountUsers = await loaders.accountUserLoader.loadMany(auIds);
      const auById = keyBy(accountUsers, 'id');

      return promises.map(gsbEntityIds, (gsbEntityId) => {
        const branches = choicesByGsbEntityId[gsbEntityId]?.branches as
          | (typeof choicesByGsbEntityId)[number]['branches']
          | undefined;

        return (
          branches?.map((branch) => {
            return {
              usersSelected:
                auIdsByGsbEntityIdGroupedByChoiceKey[gsbEntityId]?.[
                  branch.choiceKey
                ]?.reduce<AccountUser[]>((acc, auId) => {
                  const au = auById[auId];
                  if (au && au instanceof AccountUser) acc.push(au);
                  return acc;
                }, []) || [],
              choiceKey: branch.choiceKey,
              choiceLabel: branch.label,
            };
          }) || []
        );
      });
    }
  );
}
