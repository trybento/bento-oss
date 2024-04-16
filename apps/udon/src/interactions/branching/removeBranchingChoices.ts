import { Op } from 'sequelize';
import {
  Nullable,
  SelectedModelAttrs,
  SelectedModelAttrsPick,
} from 'bento-common/types';
import promises from 'src/utils/promises';

import { queryRunner } from 'src/data';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { Organization } from 'src/data/models/Organization.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';

type Args = {
  organization: Organization;
} & (
  | { templateId: number; moduleId?: never }
  | { moduleId: number; templateId?: never }
);

/**
 * When a module/template is deleted, we should no longer show any
 * branching options that will lead to it.
 *
 * @promise templateIds affected by the change
 */
export async function removeBranchingChoices({
  templateId,
  moduleId,
  organization,
}: Args): Promise<number[]> {
  if (!moduleId && !templateId) return [];

  if (moduleId && templateId) {
    throw new Error(
      'Implementation error. Cannot specify both `moduleId` and `templateId`'
    );
  }

  const paths = (await BranchingPath.findAll({
    attributes: ['branchingKey', 'choiceKey'],
    where: {
      ...(moduleId ? { moduleId } : { templateId }),
      organizationId: organization.id,
    },
    group: ['branchingKey', 'choiceKey'],
  })) as SelectedModelAttrsPick<BranchingPath, 'branchingKey' | 'choiceKey'>[];

  /** If no paths are found, we do nothing */
  if (!paths.length) return [];

  const changedStepPrototypeIds: number[] = [];

  await promises.map(
    paths,
    async (path) => {
      const sp = (await StepPrototype.findOne({
        attributes: ['id', 'branchingChoices'],
        where: {
          entityId: path.branchingKey,
          branchingChoices: {
            [Op.ne]: null,
          },
        },
      })) as Nullable<
        SelectedModelAttrs<StepPrototype, 'id' | 'branchingChoices'>
      >;

      if (!sp?.branchingChoices?.length) return;

      await sp.update({
        branchingChoices: sp.branchingChoices.filter(
          (choice) => choice.choiceKey !== path.choiceKey
        ),
      });

      changedStepPrototypeIds.push(sp.id);
    },
    { concurrency: 3 }
  );

  const affectedTemplates = (await queryRunner({
    sql: `--sql
			SELECT
        DISTINCT tm.template_id as "id"
      FROM
        core.step_prototypes sp
        JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
        JOIN core.templates_modules tm ON tm.module_id = msp.module_id
			WHERE
        sp.id IN (:changedStepPrototypeIds);
		`,
    replacements: {
      changedStepPrototypeIds,
    },
  })) as { id: number }[];

  return affectedTemplates.map((r) => r.id);
}
