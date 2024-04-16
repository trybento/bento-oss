import { REUSABLE_STEP_GROUP_FORM_FACTORS } from 'bento-common/utils/stepGroups';
import { Op } from 'sequelize';

import { Module } from 'src/data/models/Module.model';

/**
 * Cleanup orphaned step groups (aka modules) created from form factors from which we
 * do not allow reusing step groups, for all Orgs.
 *
 * @returns Promise the number of destroyed rows
 */
export default async function cleanupDetachedStepGroups(): Promise<number> {
  const rows = await Module.scope(['orphan']).findAll({
    attributes: ['id'],
    where: {
      [Op.and]: [
        {
          createdFromFormFactor: {
            [Op.notIn]: REUSABLE_STEP_GROUP_FORM_FACTORS,
          },
        },
        // protects against old modules for which this will be empty
        { createdFromFormFactor: { [Op.not]: null } },
      ],
    },
  });

  return Module.destroy({
    where: {
      id: rows.map((r) => r.id),
    },
  });
}
