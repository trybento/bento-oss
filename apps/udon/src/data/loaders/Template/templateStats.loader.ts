import Dataloader from 'dataloader';
import { keyBy } from 'lodash';

import { queryRunner } from 'src/data';

export type TemplateStatsQueryResult = {
  completedAStep: number;
  usersSeenGuide: number;
  totalStepsCompleted?: number;
  percentCompleted: number;

  usersDismissed: number;
  usersClickedCta: number;
  usersSavedForLater: number;
};

/**
 * For the guide analytics page's top info display
 *   It's an aggregate of the subloaders for guide bases
 *
 * @deprecated Possibly deprecated for individual stat loaders
 */
export default function templateStats() {
  return new Dataloader<number, TemplateStatsQueryResult | null>(
    async (templateIds) => {
      // TODO: Use helpers
      const rows = (await queryRunner({
        sql: `--sql
				with completed as (
					select
						t.id,
						coalesce(trunc(100 * TRUNC(1.0 * count(distinct case when au.id is null or g.completed_at is null then null else g.id end) / nullif(count(distinct case when au.id is null then null else g.id end), 0), 4), 1), 0) as "percentCompleted"
					from
						core.templates t
					left join core.guides g on
						g.created_from_template_id = t.id
					left join core.guide_participants gp on
						gp.guide_id = g.id
					LEFT join core.account_users au ON au.id = gp.account_user_id
					JOIN core.accounts a ON a.id = au.account_id AND a.deleted_at IS NULL
					where t.id IN (:templateIds)
					group by t.id 
					),
				viewed as (
					select
						r.template_id
						, count(distinct s.completed_by_account_user_id) as "completedAStep"
						, count(distinct au.id) as "usersSeenGuide"
						, count(distinct s.id) as "totalStepsCompleted"
					from
						analytics.guide_daily_rollup r
					JOIN core.account_users au
						ON r.account_user_id = au.id
					JOIN core.accounts a
						ON au.account_id = a.id AND a.deleted_at IS NULL
					JOIN core.guides g
						ON g.id = r.guide_id
					JOIN core.guide_bases gb
						ON g.created_from_guide_base_id = gb.id
					JOIN core.templates t
						ON gb.created_from_template_id = t.id
					LEFT JOIN
						core.steps s on (s.guide_id = r.guide_id and s.completed_by_account_user_id = r.account_user_id
							and s.completed_at IS NOT NULL)
					WHERE t.id IN (:templateIds)
					GROUP BY
						r.template_id, t.name
				)
				select
					output.id
					, coalesce(viewed."completedAStep", 0) as "completedAStep"
					, coalesce(viewed."usersSeenGuide", 0) as "usersSeenGuide"
					, coalesce(viewed."totalStepsCompleted", 0) as "totalStepsCompleted"
					, output."percentCompleted"
				from
					completed as output
				left join viewed on
					output.id = viewed.template_id;
        `,
        replacements: {
          templateIds,
        },
      })) as ({ id: number } & TemplateStatsQueryResult)[];

      const rowsByTemplateId = keyBy(rows, 'id');
      return templateIds.map((templateId) => {
        const templateStats = rowsByTemplateId?.[templateId];
        if (!templateStats) return null;
        const { id, ...restStats } = templateStats;
        return restStats;
      });
    }
  );
}
