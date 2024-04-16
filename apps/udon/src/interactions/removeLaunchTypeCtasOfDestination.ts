import { StepCtaType } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';

type Args = {
  /** Template id that could be launched */
  launchableTemplateId: number;
  /** Organization id of which the template belongs to */
  organizationId: number;
};

/**
 * When a destination guide is no longer available (e.g. got archived),
 * we then need to make sure that any launch-type CTAs associated with that
 * are also going to be removed from other guides.
 *
 * NOTE: Currently there is no need to run this when a template gets hard-deleted
 * since that will effectively cascade any related CTAs.
 *
 * @todo add unit testing?
 * @returns Promise the list of affected template ids
 */
export async function removeLaunchTypeCtasOfDestination({
  launchableTemplateId,
  organizationId,
}: Args): Promise<number[]> {
  // criteria to find all affected step prototype ctas
  const prototypeFilters = {
    type: StepCtaType.launch,
    launchableTemplateId,
    organizationId,
  };

  // find all affected templates and step prototypes to promise back
  const affectedTuples = (await queryRunner({
    sql: `--sql
      select
        distinct tm.template_id,
        spc.step_prototype_id
      from
        core.step_prototype_ctas spc
        join core.step_prototypes sp on sp.id = spc.step_prototype_id
        join core.modules_step_prototypes msp on msp.step_prototype_id = sp.id
        join core.templates_modules tm on tm.module_id = msp.module_id
      where
        spc.type = :type
        and spc.launchable_template_id = :launchableTemplateId
        and spc.organization_id = :organizationId;
    `,
    replacements: prototypeFilters,
    // explicitly set to run off of primary to avoid weird cases due to replica lag
    queryDatabase: QueryDatabase.primary,
  })) as { template_id: number; step_prototype_id: number }[];

  // drop all affected cta prototypes
  await StepPrototypeCta.destroy({ where: prototypeFilters });

  // unique list of affected template ids
  return [...new Set(affectedTuples.map((t) => t.template_id))];
}
