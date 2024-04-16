import Dataloader from 'dataloader';
import { keyBy } from 'lodash';
import { BranchingEntityType, Nullable, StepType } from 'bento-common/types';
import { BranchingFormFactor } from 'bento-common/types/globalShoyuState';

import { queryRunner } from 'src/data';
import { Loaders } from 'src/data/loaders';
import {
  BranchingBranch,
  SelectableBranchingBranch,
} from 'src/data/models/types';

export type EmbedStepBranchingType = {
  key: string | null;
  type: BranchingEntityType | null;
  question: string | null;
  multiSelect: boolean;
  dismissDisabled: boolean;
  formFactor: BranchingFormFactor | null;
  branches: SelectableBranchingBranch[];
};

export default function branchingOfStepLoader(_loaders: Loaders) {
  return new Dataloader<number, EmbedStepBranchingType>(async (stepIds) => {
    const branchingRows = await queryRunner<
      {
        stepId: number;
        key: string;
        question: string;
        multiSelect: boolean | null;
        dismissDisabled: boolean | null;
        formFactor: BranchingFormFactor | null;
        branches: BranchingBranch[];
      }[]
    >({
      sql: `--sql
        SELECT
          s.id AS "stepId",
          sp.entity_id AS "key",
          sp.branching_question AS "question",
          sp.branching_multiple AS "multiSelect",
          sp.branching_dismiss_disabled AS "dismissDisabled",
          sp.branching_form_factor AS "formFactor",
          sp.branching_choices AS "branches"
        FROM
          core.steps s
          JOIN core.step_prototypes sp ON sp.id = s.created_from_step_prototype_id
        WHERE
          sp.step_type IN (:branchingStepTypes)
          AND sp.branching_choices IS NOT NULL
          AND s.id IN (:stepIds);
        `,
      replacements: {
        branchingStepTypes: [StepType.branching, StepType.branchingOptional],
        stepIds,
      },
    });

    const branchingRowsByStepId = keyBy(branchingRows, 'stepId');

    const selectionRows = await queryRunner<
      {
        stepId: number;
        branchingPathId: number;
        type: BranchingEntityType;
        choiceKey: string;
        selected: boolean;
      }[]
    >({
      sql: `--sql
        SELECT
          s.id as "stepId",
          bp.id as "branchingPathId",
          bp.entity_type as "type",
          bp.choice_key as "choiceKey",
          CASE
            WHEN tbp.id IS NOT NULL THEN TRUE
            ELSE FALSE
          END as "selected"
        FROM
          core.steps s
          JOIN core.step_prototypes sp ON sp.id = s.created_from_step_prototype_id
          JOIN core.branching_paths bp ON bp.branching_key = sp.entity_id
          LEFT JOIN core.triggered_branching_paths tbp ON (
            tbp.branching_path_id = bp.id
            AND tbp.triggered_from_step_id = s.id
          )
        WHERE
          sp.step_type IN (:branchingStepTypes)
          AND sp.branching_choices IS NOT NULL
          AND s.id IN (:stepIds);
        `,
      replacements: {
        branchingStepTypes: [StepType.branching, StepType.branchingOptional],
        stepIds,
      },
    });

    const selectionByStepIdByChoiceKey = selectionRows.reduce<
      Record<number, Record<string, (typeof selectionRows)[number]>>
    >((acc, row) => {
      const { stepId, choiceKey } = row;
      if (!acc[stepId]) acc[stepId] = {};
      if (!acc[stepId][choiceKey]) acc[stepId][choiceKey] = row;
      return acc;
    }, {});

    return stepIds.map((stepId) => {
      const info = branchingRowsByStepId[stepId] as
        | (typeof branchingRows)[number]
        | undefined;

      if (!info) {
        return {
          key: null,
          type: null,
          question: null,
          multiSelect: false,
          dismissDisabled: false,
          formFactor: null,
          branches: [],
        };
      }

      const selections = selectionByStepIdByChoiceKey[stepId] as
        | Record<string, (typeof selectionRows)[number]>
        | undefined;

      const branchingType = selections
        ? Object.values(selections)?.[0]?.type
        : null;

      return {
        key: info.key,
        type: branchingType,
        question: info.question,
        multiSelect: !!info.multiSelect,
        dismissDisabled: !!info.dismissDisabled,
        formFactor: info.formFactor,
        branches: info.branches.map((b) => ({
          ...b,
          selected: !!selections?.[b.choiceKey]?.selected,
          formFactor: info.formFactor,
        })),
      };
    });
  });
}
