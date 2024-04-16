import {
  isAnnouncementGuide,
  isInlineEmbed,
} from 'bento-common/utils/formFactor';
import { countWords, getWordCountMax } from 'bento-common/utils/slateWordCount';

import { QueryDatabase, queryRunner } from 'src/data';
import { sortArrayByObjectKey } from 'src/utils/helpers';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { Module } from 'src/data/models/Module.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { combineObjectLists, toFixedNumerical } from './reports.helpers';
import {
  ValueData,
  ValueDataPayload,
} from 'src/data/models/Analytics/ValueData.model';

type Args = {
  organization: Organization;
  engagedCustomerLimit?: number;
};

// TODO: Break the queries possibly into smaller pieces, or at least helpers in analytics/stats

/** Organized by the sections in the email at design */
export default async function generateValueDataForOrg({
  organization,
  engagedCustomerLimit,
}: Args) {
  const blocks = [
    /* Block 1: Raw counts */
    getRawCounts,
    /* Block 2: Announcements/Empty states */
    getCategoryStats,
    /* Block 3: Times to complete */
    getTimesToComplete,
    /* Block 4: Dropoffs */
    getLowestCompletionRateStep,
    /* Block 5: Engaged customers */
    getMostEngagedCustomer(engagedCustomerLimit || 5),
    /* Block 6: Content */
    getTemplateUnderWordCount,
  ];

  const b: Partial<ValueDataPayload>[] = [];
  for (const fn of blocks) {
    const result = await fn(organization);
    b.push(result);
  }

  const valueData: ValueDataPayload = combineObjectLists(b);

  await ValueData.upsert({
    organizationId: organization.id,
    data: valueData,
  });
}

/*
 * ===== HELPER FUNCTIONS FOR BUILDING BLOCK BELOW ====
 */

/** Get simple counts for some basic stats */
const getRawCounts = async (organization: Organization) => {
  const ret: Partial<ValueDataPayload> = {
    guidesLaunched: 0,
    stepsCompleted: 0,
    uniqueUsersLaunchedTo: 0,
  };

  const sql = `--sql
		WITH selected_guide_bases AS (
			-- Onboarding, contextual sidebar + tooltips
			SELECT
        gb.id, gb.activated_at
      FROM
        core.guide_bases gb
        JOIN core.templates t ON t.id = gb.created_from_template_id
      WHERE
        gb.organization_id = :organizationId
        AND (
          t.is_side_quest = FALSE
          OR t.form_factor IN ('sidebar', 'tooltip')
        )
		)
		SELECT
			(
        SELECT COUNT(*) FROM selected_guide_bases gb
				WHERE gb.activated_at >= (NOW() - INTERVAL '1 MONTH')
			) as guide_bases_launched,
			(
        SELECT COUNT(*) FROM core.steps s
				JOIN core.guides g ON s.guide_id = g.id
				JOIN selected_guide_bases gb ON g.created_from_guide_base_id = gb.id
				WHERE s.organization_id = :organizationId AND s.completed_at >= (NOW() - INTERVAL '1 MONTH')
			) as steps_completed,
			(
        SELECT COUNT(DISTINCT gp.account_user_id) FROM core.guide_participants gp
				JOIN core.guides g ON gp.guide_id = g.id
				JOIN selected_guide_bases gb ON g.created_from_guide_base_id = gb.id
				WHERE gp.organization_id = :organizationId AND gp.created_at >= (NOW() - INTERVAL '1 MONTH')
			) as new_unique_guide_participants;
	`;

  const results = (await queryRunner({
    sql,
    replacements: {
      organizationId: organization.id,
    },
    queryDatabase: QueryDatabase.follower,
  })) as {
    guide_bases_launched: number;
    steps_completed: number;
    new_unique_guide_participants: number;
  }[];

  if (!results.length) return ret;

  /** "use cases" are just cyoa paths */
  const useCasesSql = `--sql
		SELECT t.id, COUNT(bp.id) FROM core.templates t
		JOIN core.templates_modules tm ON tm.template_id = t.id
		JOIN core.modules_step_prototypes msp ON msp.module_id = tm.module_id
		JOIN core.step_prototypes sp ON sp.id = msp.step_prototype_id
		JOIN core.branching_paths bp ON bp.branching_key = sp.entity_id
		WHERE t.is_cyoa = true AND t.organization_id = :organizationId
		GROUP BY t.id
		ORDER BY t.updated_at DESC
		LIMIT 1;
	`;

  const useCasesRow = (await queryRunner({
    sql: useCasesSql,
    replacements: {
      organizationId: organization.id,
    },
    queryDatabase: QueryDatabase.follower,
  })) as { id: number; count: number }[];

  const result = results[0];

  ret.guidesLaunched = +result.guide_bases_launched;
  ret.stepsCompleted = +result.steps_completed;
  ret.uniqueUsersLaunchedTo = +result.new_unique_guide_participants;
  ret.useCases = +(useCasesRow?.[0]?.count || 0);

  return ret;
};

/** Simple stats for specific category of guides */
const getCategoryStats = async (organization: Organization) => {
  const ret: Partial<ValueDataPayload> = {
    announcementsLaunched: 0,
    uniqueUsersSeenAnnouncements: 0,
    emptyStatesLaunched: 0,
    uniqueUsersSeenEmptyStates: 0,
  };

  const sql = `--sql
		SELECT	
			(
        SELECT
          COUNT(*)
        FROM
          core.guide_bases gb
				WHERE
          gb.created_from_template_id IN (:templateIds)
          AND gb.activated_at >= (NOW() - INTERVAL '1 MONTH')
      ) as launched,		
			(
        SELECT
          COUNT(DISTINCT sdr.account_user_id)
        FROM
          analytics.step_daily_rollup sdr
          JOIN core.steps s ON sdr.step_id = s.id
          JOIN core.guides g ON s.guide_id = g.id
				WHERE
          g.created_from_template_id IN (:templateIds)
          AND sdr.date >= (NOW() - INTERVAL '1 MONTH')
      ) as seen;
	`;

  /* Get template ids first so we can re-use the designType helpers */
  const allTemplates = await Template.scope('contentTemplates').findAll({
    where: {
      organizationId: organization.id,
    },
    attributes: ['id', 'formFactor'],
  });

  const { announcementIds, emptyStateIds } = allTemplates.reduce(
    (a, v) => {
      if (isAnnouncementGuide(v.formFactor!)) a.announcementIds.push(v.id);
      if (isInlineEmbed(v.formFactor!)) a.emptyStateIds.push(v.id);

      return a;
    },
    { announcementIds: [] as number[], emptyStateIds: [] as number[] }
  );

  if (announcementIds.length > 0) {
    const results = (await queryRunner({
      sql,
      replacements: {
        templateIds: announcementIds,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { launched: number; seen: number }[];

    const result = results[0] || {};

    ret.announcementsLaunched = +result.launched || 0;
    ret.uniqueUsersSeenAnnouncements = +result.seen || 0;
  }

  if (emptyStateIds.length > 0) {
    const results = (await queryRunner({
      sql,
      replacements: {
        templateIds: emptyStateIds,
      },
    })) as { launched: number; seen: number }[];

    const result = results[0] || {};

    ret.emptyStatesLaunched = +result.launched || 0;
    ret.uniqueUsersSeenEmptyStates = +result.seen || 0;
  }

  return ret;
};

const getTimesToComplete = async (organization: Organization) => {
  const sql = `--sql
		SELECT avg(abs(g.completed_at::date - g.launched_at::date)) AS avg_date_diff
    FROM core.guides g
		WHERE g.completed_at IS NOT NULL
			AND g.completed_at >= (NOW() - INTERVAL '1 MONTH')
			AND g.organization_id = :organizationId
	`;

  const results = (await queryRunner({
    sql,
    replacements: { organizationId: organization.id },
    queryDatabase: QueryDatabase.follower,
  })) as { avg_date_diff: number }[];

  if (!results.length) return {};

  return {
    averageGuideCompletionTimeInDays: Math.ceil(
      Number(results[0].avg_date_diff)
    ),
  } as Partial<ValueDataPayload>;
};

/**
 * The lowest (completion / "viewed") with views counts as the least engaging step.
 * We assume this as the highest dropoff, indicating a step people see and don't complete
 */
const getLowestCompletionRateStep = async (organization: Organization) => {
  const sql = `
		WITH users_completed AS (
			SELECT DISTINCT s.created_from_step_prototype_id AS sp_id, s.completed_by_account_user_id AS au_id FROM core.steps s
			WHERE s.completed_at >= (NOW() - INTERVAL '1 MONTH')
				AND s.organization_id = :organizationId
				AND s.completed_by_account_user_id IS NOT NULL
		),
		users_skipped AS (
			SELECT DISTINCT s.created_from_step_prototype_id AS sp_id, sp.account_user_id AS au_id FROM core.steps s
			JOIN core.step_participants sp ON sp.step_id = s.id
			WHERE sp.skipped_at >= (NOW() - INTERVAL '1 MONTH')
				AND s.organization_id = :organizationId
		),
		users_viewed AS (
			SELECT DISTINCT sdr.step_prototype_id AS sp_id, sdr.account_user_id AS au_id FROM analytics.step_daily_rollup sdr
			-- we have a relatively convoluted system where skips/completes = views
			LEFT JOIN users_skipped sk ON sk.sp_id = sdr.step_prototype_id
			LEFT JOIN users_completed uc ON uc.sp_id = sdr.step_prototype_id
			WHERE sdr.date >= (NOW() - INTERVAL '1 MONTH')
				AND sdr.organization_id = :organizationId
		)
		SELECT c.sp_id, COUNT(DISTINCT c.au_id) AS completed, COUNT(DISTINCT s.au_id) AS skipped, COUNT(DISTINCT v.au_id) AS viewed FROM users_completed c
		LEFT JOIN users_skipped s ON s.sp_id = c.sp_id
		LEFT JOIN users_viewed v ON v.sp_id = c.sp_id
		-- Filter by stuff still in a template
		JOIN core.modules_step_prototypes msp ON msp.step_prototype_id = c.sp_id
		JOIN core.templates_modules tm ON tm.module_id = msp.module_id
		JOIN core.templates t ON tm.template_id = t.id
		WHERE t.is_side_quest = FALSE
		GROUP BY c.sp_id
		HAVING COUNT(DISTINCT v.au_id) > 0;
	`;

  /* Bring all data back first so we can do whatever with it */
  const rows = (await queryRunner({
    sql,
    replacements: { organizationId: organization.id },
    queryDatabase: QueryDatabase.follower,
  })) as {
    sp_id: number;
    completed: number;
    skipped: number;
    viewed: number;
  }[];

  if (!rows.length) return {};

  const sortedByCompletionRate = sortArrayByObjectKey(
    rows.map((r) => ({ ...r, completionRate: r.completed / r.viewed })),
    'completionRate',
    true
  );

  const lowestCompletionRateSpId = sortedByCompletionRate[0];

  const results = (await queryRunner({
    sql: `SELECT sp.name, t.entity_id FROM core.step_prototypes sp
			JOIN core.modules_step_prototypes msp ON sp.id = msp.step_prototype_id
			JOIN core.templates_modules tm ON tm.module_id = msp.module_id
			JOIN core.templates t ON tm.template_id = t.id
			WHERE sp.id = :stepPrototypeId LIMIT 1`,
    replacements: { stepPrototypeId: lowestCompletionRateSpId.sp_id },
    queryDatabase: QueryDatabase.follower,
  })) as { name: string; entity_id: string }[];

  if (!results.length) return {};

  return {
    dropOffStep: {
      name: results[0].name,
      templateEntityId: results[0].entity_id,
      percentComplete: toFixedNumerical(
        sortedByCompletionRate[0].completionRate * 100,
        2
      ),
    },
  } as Partial<ValueDataPayload>;
};

/**
 * Get the 5 most engaged customers based on step events
 */
const getMostEngagedCustomer =
  (engagedCustomerLimit: number) => async (organization: Organization) => {
    const sql = `--sql
		SELECT
      a.name, a.entity_id,
      COUNT(se.*)
    FROM analytics.step_events se
		JOIN core.account_users au ON se.account_user_entity_id = au.entity_id
		JOIN core.accounts a ON a.id = au.account_id
		JOIN core.steps s ON se.step_entity_id = s.entity_id
		JOIN core.guides g ON s.guide_id = g.id
    JOIN core.templates t ON t.id = g.created_from_template_id
		WHERE se.created_at >= (NOW() - INTERVAL '1 MONTH')
			AND a.organization_id = :organizationId
			AND se.event_name != 'step_viewing_ended'
			AND a.deleted_at IS NULL
			AND a.name NOT LIKE '%Bento%'
			AND a.name NOT LIKE '%Test%'
			AND t.is_side_quest = false
		GROUP BY a.name, a.entity_id
		ORDER BY 3 DESC
		LIMIT :limit;
	`;

    const results = (await queryRunner({
      sql,
      replacements: {
        organizationId: organization.id,
        limit: engagedCustomerLimit,
      },
      queryDatabase: QueryDatabase.follower,
    })) as { name: string; entity_id: string; count: number }[];

    if (!results.length) return {};

    return {
      mostEngagedCustomer: results.map((row) => ({
        name: row.name,
        entityId: row.entity_id,
        numEvents: +row.count,
      })),
    } as Partial<ValueDataPayload>;
  };

/** Scan onboarding guides for a guide that's within recommended word counts */
const getTemplateUnderWordCount = async (organization: Organization) => {
  const templateIdsWithGuideBases = (await queryRunner({
    sql: `--sql
      SELECT
        t.id, 
        COUNT(gb.id)
      FROM
        core.templates t
        JOIN core.guide_bases gb ON gb.created_from_template_id = t.id
      WHERE
        t.organization_id = :organizationId
        AND t.is_side_quest = FALSE
      GROUP BY t.id
      ORDER BY 2 DESC
		`,
    replacements: { organizationId: organization.id },
    queryDatabase: QueryDatabase.follower,
  })) as { id: number; count: number }[];

  if (!templateIdsWithGuideBases.length) return {};

  const templates = await Template.scope('contentTemplates').findAll({
    where: {
      id: templateIdsWithGuideBases.map((r) => r.id),
    },
    include: [{ model: Module, include: [StepPrototype] }],
  });

  const templatesUnderWordCount = templates.filter((template) => {
    const stepPrototypes = template.modules.reduce((a, v) => {
      a.push(...(v.stepPrototypes || []));
      return a;
    }, [] as StepPrototype[]);

    const [_, max] = getWordCountMax(template.formFactor);

    return stepPrototypes.every((sp) => countWords(sp.bodySlate) < max);
  });

  if (!templatesUnderWordCount.length) return {};

  return {
    guideWithLowWordCount: {
      name: templatesUnderWordCount[0].name,
      entityId: templatesUnderWordCount[0].entityId,
    },
  } as Partial<ValueDataPayload>;
};
