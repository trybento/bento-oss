import { Guide } from 'src/data/models/Guide.model';
import { fetchAndMapDynamicAttributes } from 'src/interactions/replaceDynamicAttributes';
import { queryRunner } from 'src/data';
import { GraphQLFieldResolver } from 'graphql';
import { EmbedContext } from '../types';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { interpolateAttributes } from 'bento-common/data/helpers';

export const dynamicAttributesResolver = async (
  value: string,
  account: Account,
  accountUser: AccountUser
): Promise<string> => {
  const attrs = await fetchAndMapDynamicAttributes(account, accountUser);
  return interpolateAttributes(value, attrs);
};

export const canResetOnboardingResolver:
  | GraphQLFieldResolver<
      Guide,
      EmbedContext,
      {
        [argName: string]: any;
      }
    >
  | undefined = async (guide, _args, { organization }) => {
  if (!guide.completedAt) return false;

  const results = (await queryRunner({
    sql: `--sql
    SELECT
      bp.id
    FROM
      core.branching_paths bp
      JOIN core.step_prototypes sp
				ON sp.entity_id = bp.branching_key
      JOIN core.guide_step_bases gsb 
				ON gsb.created_from_step_prototype_id = sp.id
				AND gsb.deleted_at IS NULL
      JOIN core.guide_bases gb 
				ON gb.id = gsb.guide_base_id
      JOIN core.guides g
				ON g.created_from_guide_base_id = gb.id
    WHERE
      bp.entity_type = 'guide'
      AND g.id = :guideId
      AND g.organization_id = :organizationId
    LIMIT 1
    `,
    replacements: {
      guideId: guide.id,
      organizationId: organization.id,
    },
  })) as any[];

  return !!results.length;
};
