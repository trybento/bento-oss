import { AtLeast, AttributeType, SelectedModelAttrs } from 'bento-common/types';

import { Loaders } from 'src/data/loaders';
import { QueryDatabase, queryRunner } from 'src/data';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { Organization } from 'src/data/models/Organization.model';

type Args = {
  attribute: AtLeast<
    CustomAttribute | { name: string; type: AttributeType },
    'name' | 'type'
  >;
  organization: SelectedModelAttrs<Organization, 'id'>;
  loaders?: Loaders;
  fetchOne?: boolean;
};

export default async function fetchAutolaunchedGuideBasesForAttribute({
  attribute,
  organization,
  loaders,
  fetchOne,
}: Args) {
  const ruleRowsSql =
    attribute.type === AttributeType.account
      ? `--sql
        SELECT
          gb.id AS guide_base_id,
          tar.rules
        FROM core.template_auto_launch_rules tar
        JOIN core.guide_bases gb
          ON gb.created_from_template_id = tar.template_id
        WHERE tar.organization_id = :organizationId
          AND tar.rule_type = 'attribute_rules'
      `
      : `--sql
        SELECT
          gb.id AS guide_base_id,
          tt.rules
        FROM core.template_targets tt
        JOIN core.guide_bases gb
          ON gb.created_from_template_id = tt.template_id
        WHERE tt.organization_id = :organizationId
          AND tt.target_type = 'attribute_rules'
      `;

  const sql = `--sql
    WITH rule_rows AS (
      ${ruleRowsSql}
    )
    SELECT DISTINCT
      rule_rows.guide_base_id
    FROM rule_rows
    JOIN core.guide_bases gb
      ON rule_rows.guide_base_id = gb.id
    JOIN core.templates t
      ON gb.created_from_template_id = t.id
      AND t.archived_at IS NULL
      AND t.deleted_at IS NULL
    JOIN core.accounts a
      ON gb.account_id = a.id
    CROSS JOIN jsonb_array_elements(rule_rows.rules) AS e(obj)
    WHERE e.obj::jsonb ->> 'attribute' LIKE :attributeName
      AND a.deleted_at IS NULL
      AND gb.created_from_template_id IS NOT NULL
    ${fetchOne ? 'LIMIT 1' : ''};
  `;

  const rows = (await queryRunner({
    sql,
    replacements: {
      organizationId: organization.id,
      attributeName: `%${attribute.name}%`,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { guide_base_id: number }[];

  if (rows.length === 0) return [];

  const guideBaseIds = rows.map((r) => r.guide_base_id);

  if (!loaders) return guideBaseIds;

  return loaders.guideBaseLoader.loadMany(guideBaseIds);
}
