import promises from 'src/utils/promises';
import { keyBy } from 'lodash';
import { GuideState } from 'bento-common/types';

import { QueryDatabase, queryRunner } from 'src/data';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';

import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { LaunchReport } from '../reporting/LaunchReport';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';

/**
 * Operates only for "All" targeting user guides.
 * Targeted guides are handled by addUserToGuidesBasedOnTargetedAttributes,
 *   which needs a longer name
 */
export default async function createIndividualGuidesForCreatedAccountUser(
  accountUser: AccountUser,
  launchReport?: LaunchReport
) {
  const now = new Date();
  const eligibleGuideBases = (await queryRunner({
    sql: `--sql
      SELECT DISTINCT
        gb.id AS "guideBaseId",
        tt.id as "templateTargetId",
        t.id AS "templateId"
      FROM core.guide_bases gb
      JOIN core.accounts a
        ON a.id = gb.account_id
      JOIN core.account_users au
        ON au.account_id = a.id
      JOIN core.templates t
        ON t.id = gb.created_from_template_id
      JOIN core.template_targets tt
        ON tt.template_id = t.id
			LEFT JOIN core.template_audiences ta
				ON ta.template_id = t.id
      WHERE gb.account_id = :accountId
        AND gb.state = 'active'
        AND t.type = 'user'
        AND tt.target_type = 'all'
				AND ta.id IS NULL -- Having audiences = having rules
        AND au.id = :accountUserId
        AND t.archived_at IS NULL
        AND a.deleted_at IS NULL
        AND (
          t.auto_launch_for_account_users_created_after IS NULL
          OR (
            t.auto_launch_for_account_users_created_after IS NOT NULL
            AND au.created_in_organization_at IS NOT NULL
            AND t.auto_launch_for_account_users_created_after < au.created_in_organization_at
          )
        )
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
  })) as {
    guideBaseId: number;
    templateTargetId: number;
    templateId: number;
  }[];

  if (eligibleGuideBases.length === 0) {
    return [];
  }

  const rowsByGuideBaseId = keyBy(eligibleGuideBases, 'guideBaseId');

  const guideBases = await GuideBase.scope({
    method: [
      'withTemplate',
      {
        required: true,
        attributes: ['name'],
      },
    ],
  }).findAll({
    where: {
      id: eligibleGuideBases.map((row) => row.guideBaseId),
    },
  });

  const guides = await promises.mapSeries(guideBases, (guideBase) =>
    createGuideFromGuideBase({
      guideBase,
      state: GuideState.active,
      launchedAt: now,
      accountUser,
    })
  );

  const existingParticipants = await GuideParticipant.findAll({
    where: { guideId: guides.map((g) => g.id), accountUserId: accountUser.id },
    attributes: ['guideId'],
    group: 'guideId',
  });

  const existingParticipantGuideIds = existingParticipants.map(
    (p) => p.guideId
  );

  const guidesWithoutParticipant = guides.filter(
    (guide) => !existingParticipantGuideIds.includes(guide.id)
  );

  const gpData = guidesWithoutParticipant.map((guide) => ({
    guideId: guide.id,
    accountUserId: accountUser.id,
    organizationId: accountUser.organizationId,
    createdFromTemplateTargetId:
      rowsByGuideBaseId[guide.createdFromGuideBaseId].templateTargetId,
  }));

  await sequelizeBulkUpsert(GuideParticipant, gpData, {
    upsertOpts: { returning: false },
  });

  for (const guideBase of guideBases) {
    launchReport?.addMatchLog(
      'template',
      rowsByGuideBaseId[guideBase.id].templateId,
      '(user guide) matched user user/all targets',
      guideBase.createdFromTemplate!.name
    );
  }

  return guidesWithoutParticipant;
}
