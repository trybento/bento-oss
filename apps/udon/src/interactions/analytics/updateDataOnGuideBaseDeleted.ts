import { SelectedModelAttrs } from 'src/../../common/types';
import { queryRunner } from 'src/data';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import { JobType } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { enableUpdateAccountUserData } from 'src/utils/internalFeatures/internalFeatures';
import { logger } from 'src/utils/logger';

/**
 * Update numbers on guide base deletion to reflect lesser numbers
 */
export default async function updateDataOnGuideBaseDelete(
  guideBase: SelectedModelAttrs<
    GuideBase,
    'id' | 'entityId' | 'accountId' | 'organizationId'
  >,
  /* We may not need to do this if the users are no longer relevant. */
  skipAccountUserData?: boolean
) {
  /* Account user data */
  if (!skipAccountUserData) await updateForAccountUsers(guideBase);

  await updateAnnouncementData(guideBase);

  /* Step data, aggregated above the guide base level */
  await updateForStepData(guideBase);
}

/**
 * Remove deprecated gb stats from au's data
 */
const updateForAccountUsers = async (
  guideBase: SelectedModelAttrs<GuideBase, 'id' | 'entityId'>
) => {
  const sql = `--sql
    SELECT
      au.entity_id as "accountUserEntityId"
    FROM
      core.guide_participants gp
      LEFT JOIN core.account_users au ON gp.account_user_id = au.id
      LEFT JOIN core.guides g ON gp.guide_id = g.id
      LEFT JOIN core.guide_bases gb ON g.created_from_guide_base_id = gb.id
    WHERE
      gb.id = :guideBaseId;
  `;

  const isEnabled = await enableUpdateAccountUserData.enabled();

  if (isEnabled) {
    const accountUsersOnGuideBase = (await queryRunner({
      sql,
      replacements: {
        guideBaseId: guideBase.id,
      },
    })) as { accountUserEntityId: string }[];

    if (accountUsersOnGuideBase.length) {
      const organization = await guideBase.$get('organization');

      if (!organization) return;

      await queueJob(
        {
          jobType: JobType.UpdateAccountUserData,
          accountUserEntityIds: accountUsersOnGuideBase.map(
            (r) => r.accountUserEntityId
          ),
        },
        {
          delayInMs: 1000,
        }
      );
    }
  }
};

/**
 * StepData is aggregated above gb level, so it'll need to be updated
 */
const updateForStepData = async (
  guideBase: SelectedModelAttrs<GuideBase, 'id'>
) => {
  const guideStepBases = await GuideStepBase.findAll({
    where: {
      guideBaseId: guideBase.id,
    },
    attributes: ['createdFromStepPrototypeId'],
  });

  if (guideStepBases.length === 0) return;

  const stepPrototypeIds = guideStepBases
    .map((gsb) => gsb.createdFromStepPrototypeId)
    .filter(Boolean) as number[];

  await queueJob({
    jobType: JobType.UpdateStepData,
    stepPrototypeIds,
  });
};

/**
 * When we delete a guide base we need to recount the CTA activity it touches
 *   see AnnouncementDailyActivity
 *   It will be a function of dates touched and template touched
 */
const updateAnnouncementData = async (
  guideBase: SelectedModelAttrs<GuideBase, 'id'>
) => {
  const templateId = guideBase.createdFromTemplateId;
  if (!templateId) return;

  const dateRows = (await queryRunner({
    sql: `--sql
			SELECT DISTINCT
				date_trunc('day', se.created_at) AS "eventDate"
			FROM analytics.step_events se
			JOIN core.steps s ON se.step_entity_id = s.entity_id
			JOIN core.guides g ON s.guide_id = g.id
			WHERE g.created_from_guide_base_id = :guideBaseId;
		`,
    replacements: {
      guideBaseId: guideBase.id,
    },
  })) as { eventDate: Date }[];

  for (const dateRow of dateRows) {
    const date = dateRow.eventDate;
    const formatted = `${date.getUTCFullYear()}-${
      date.getUTCMonth() + 1
    }-${date.getUTCDate()}`;

    logger.debug(
      `[updateAnnouncementData] Recount for ${templateId} on ${formatted}`
    );

    await queueJob(
      {
        jobType: JobType.UpdateAnnouncementData,
        date: formatted,
        templateIds: [templateId],
        trim: true,
      },
      {
        delayInMs: 5000,
      }
    );
  }
};
