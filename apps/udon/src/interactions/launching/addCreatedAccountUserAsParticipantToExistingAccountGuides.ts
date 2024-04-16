import { QueryDatabase, queryRunner } from 'src/data';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide } from 'src/data/models/Guide.model';
import { LaunchReport } from '../reporting/LaunchReport';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';

export default async function addCreatedAccountUserAsParticipantToExistingAccountGuides(
  accountUser: AccountUser,
  launchReport?: LaunchReport
) {
  const eligibleGuides = (await queryRunner({
    sql: `--sql
      SELECT DISTINCT
        g.id AS "guideId",
        tt.id as "templateTargetId",
        t.id AS "templateId"
      FROM core.guides g
      JOIN core.guide_bases gb
        ON gb.id = g.created_from_guide_base_id
      JOIN core.templates t
        ON t.id = gb.created_from_template_id
      JOIN core.template_targets tt
        ON tt.template_id = t.id
			LEFT JOIN core.template_audiences ta
				ON ta.template_id = t.id
      WHERE g.state = 'active'
        AND t.type = 'account'
        AND gb.state = 'active'
        AND gb.account_id = :accountId
        AND t.archived_at IS NULL
        AND tt.target_type = 'all'
				AND ta.id IS NULL -- Having audiences counts as having rules
				AND g.deleted_at IS NULL
        AND (
          gb.exclude_from_user_targeting IS NULL
          OR gb.exclude_from_user_targeting = FALSE
        )
    `,
    replacements: {
      accountId: accountUser.accountId,
      accountUserId: accountUser.id,
      accountUserExternalId: accountUser.externalId,
      accountUserEmail: accountUser.email!,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { templateTargetId: number; guideId: number; templateId: number }[];

  if (eligibleGuides.length === 0) {
    return [];
  }

  const existingParticipants = await GuideParticipant.findAll({
    where: {
      guideId: eligibleGuides.map((r) => r.guideId),
      accountUserId: accountUser.id,
    },
    attributes: ['guideId'],
    group: 'guideId',
  });

  const existingParticipantGuideIds = existingParticipants.map(
    (p) => p.guideId
  );

  const guidesWithoutParticipant = eligibleGuides.filter(
    (r) => !existingParticipantGuideIds.includes(r.guideId)
  );

  const gpData = guidesWithoutParticipant.map((row) => ({
    guideId: row.guideId,
    accountUserId: accountUser.id,
    createdFromTemplateTargetId: row.templateTargetId,
    organizationId: accountUser.organizationId,
  }));

  await sequelizeBulkUpsert(GuideParticipant, gpData, {
    upsertOpts: { returning: false },
  });

  for (const { templateId } of eligibleGuides) {
    launchReport?.addMatchLog(
      'template',
      templateId,
      '(account guide) matched user/all targets'
    );
  }

  return Guide.findAll({
    where: { id: guidesWithoutParticipant.map((r) => r.guideId) },
  });
}
