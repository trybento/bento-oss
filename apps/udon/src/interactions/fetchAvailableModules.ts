import { GuideFormFactor, Theme } from 'bento-common/types';
import {
  REUSABLE_STEP_GROUP_FORM_FACTORS,
  NON_REUSABLE_STEP_GROUP_THEMES,
} from 'bento-common/utils/stepGroups';

import { queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';

const REUSABLE_MODULES_QUERY = `--sql
  SELECT
    m.id
  FROM
    core.modules m
  WHERE
    organization_id = :organizationId
    AND m.is_cyoa IS NOT TRUE
    -- excludes disallowed form factors for stranded step groups
    AND (
      -- we allow null because old modules wont have this information
      m.created_from_form_factor IS NULL
      OR m.created_from_form_factor IN (:allowedFormFactors)
    )
    AND NOT EXISTS (
      SELECT
        1
      FROM
        core.templates_modules tm
        JOIN core.templates t ON (tm.template_id = t.id)
      WHERE
        tm.module_id = m.id
        AND (
          -- exclude internal templates
          t.is_template = TRUE
          -- exclude cyoa templates
          OR t.is_cyoa = TRUE
          -- exclude disallowed ffs
          OR t.form_factor NOT IN (:allowedFormFactors)
          -- exclude disallowed themes
          OR t.theme IN (:disallowedThemes)
        )
    )
    -- filter out internal template's branching destination modules
    AND NOT EXISTS (
      SELECT
        1
      FROM
        core.branching_paths bp
        JOIN core.step_prototypes sp ON sp.entity_id = bp.branching_key
        JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = sp.id
        JOIN core.templates_modules tm ON tm.module_id = msp.module_id
        JOIN core.templates t ON tm.template_id = t.id
      WHERE
        t.is_template = TRUE
        AND bp.module_id = m.id
    )
  ORDER BY
    updated_at DESC
;`;

type FetchAvailableModuleIdsArgs = {
  organization: Organization;
  /** Allowed form factors to return modules from */
  allowedFormFactors?: GuideFormFactor[];
  /** Allowed themes to return modules from */
  disallowedThemes?: Theme[];
};

/**
 * We're now using an allow list for both form factors and themes
 * here so that we don't introduce bugs where we're returning modules
 * that cannot be reused across form factors.
 */
export async function fetchAvailableModuleIds({
  organization,
  allowedFormFactors = REUSABLE_STEP_GROUP_FORM_FACTORS,
  disallowedThemes = NON_REUSABLE_STEP_GROUP_THEMES,
}: FetchAvailableModuleIdsArgs) {
  return (
    (await queryRunner({
      sql: REUSABLE_MODULES_QUERY,
      replacements: {
        organizationId: organization.id,
        allowedFormFactors,
        disallowedThemes,
      },
    })) as { id: number }[]
  ).map((x) => x.id);
}
