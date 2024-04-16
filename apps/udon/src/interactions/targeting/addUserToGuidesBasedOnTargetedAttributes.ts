import promises from 'src/utils/promises';

import {
  GuideBaseState,
  GuideState,
  GuideTypeEnum,
  SelectedModelAttrs,
} from 'bento-common/types';
import createGuideFromGuideBase from 'src/interactions/createGuideFromGuideBase';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from 'src/data/models/GuideParticipant.model';
import { Guide } from 'src/data/models/Guide.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { LaunchReport } from '../reporting/LaunchReport';
import {
  getTargetingExtraAttributes,
  excludeExtraAttributeTargeting,
  formatTargeting,
} from './targeting.helpers';
import { checkAttributeRulesMatch } from 'src/interactions/targeting/checkAttributeRulesMatch';
import { TargetAttributeRules } from 'src/interactions/targeting/types';
import { QueryDatabase, queryRunner } from 'src/data';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { Template } from 'src/data/models/Template.model';
import createGuideForAccountGuideBase from '../launching/createGuideForAccountGuideBase';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';

/**
 * Determine whether or not to create a guide participant based on targeting rules.
 */
export async function addUserToGuidesBasedOnTargetedAttributes(
  accountUser: AccountUser,
  launchReport?: LaunchReport
) {
  const eligibleGuideBases = await queryRunner<{ guideBaseId: number }[]>({
    sql: `--sql
      WITH eligible_gb AS (
				SELECT DISTINCT
					gb.id
				FROM core.guide_bases gb
				JOIN core.templates t ON t.id = gb.created_from_template_id
					AND t.archived_at IS NULL
					AND t.deleted_at IS NULL
				JOIN core.template_targets tt ON tt.template_id = t.id
				LEFT JOIN core.template_audiences ta ON ta.template_id = t.id
				WHERE
					gb.account_id = :accountId
					AND gb.state = :guideBaseState
					AND (
						gb.exclude_from_user_targeting IS NULL
						OR gb.exclude_from_user_targeting = FALSE
					)
					AND (
						tt.target_type = 'attribute_rules'
						OR ta.id IS NOT NULL
					)
				)
			SELECT DISTINCT
				gb.id AS "guideBaseId"
			FROM eligible_gb gb
			LEFT JOIN core.guides g ON g.created_from_guide_base_id = gb.id
			LEFT JOIN core.guide_participants gp ON gp.guide_id = g.id
				AND gp.account_user_id = :accountUserId
			WHERE gp.id IS NULL
    `,
    replacements: {
      accountId: accountUser.accountId,
      accountUserId: accountUser.id,
      guideBaseState: GuideBaseState.active,
    },
    queryDatabase: QueryDatabase.primary,
  });

  if (eligibleGuideBases.length === 0) {
    return [];
  }

  const guideBases = (await GuideBase.findAll({
    where: {
      id: eligibleGuideBases.map((r) => r.guideBaseId),
    },
    include: {
      model: Template,
      required: true,
      include: [
        {
          model: TemplateTarget,
          required: false,
          where: {
            targetType: 'attribute_rules',
          },
        },
        {
          model: TemplateAudience,
          required: false,
          attributes: ['ruleType', 'audienceEntityId', 'groupIndex'],
        },
      ],
    },
  })) as Array<
    GuideBase & {
      createdFromTemplate: SelectedModelAttrs<Template, 'name'> & {
        templateAudiences: SelectedModelAttrs<
          TemplateAudience,
          'ruleType' | 'audienceEntityId' | 'groupIndex'
        >[];
      };
    }
  >;

  if (guideBases.length === 0) {
    return [];
  }

  const { templatesByAccountUser, branchingPathsByAccountUser, audiences } =
    await getTargetingExtraAttributes({
      organizationId: accountUser.organizationId,
      accountUserIds: [accountUser.id],
      excludes: excludeExtraAttributeTargeting(
        guideBases.flatMap(
          (gb) => gb.createdFromTemplate?.templateTargets || []
        )
      ),
    });

  /* Prevent creating dup gp rows and throwing a uniq constraint error */
  const guideBasesAdded = new Set<number>();

  const guidesAndTargets = (
    await promises.mapSeries(guideBases, async (guideBase) => {
      if (guideBasesAdded.has(guideBase.id)) {
        return null;
      }

      const groupRules = formatTargeting({
        autoLaunchRules: [],
        templateTargets: guideBase.createdFromTemplate?.templateTargets,
        templateAudiences: guideBase.createdFromTemplate?.templateAudiences,
      });

      const targets =
        groupRules.audiences?.groups ??
        guideBase.createdFromTemplate?.templateTargets;

      if (!targets) {
        return null;
      }

      const templates = templatesByAccountUser[accountUser.id] || [];
      const branchingSelections =
        branchingPathsByAccountUser[accountUser.id] || [];

      for (const target of targets) {
        const doesUserMatchTargetedAttributeRules = checkAttributeRulesMatch({
          rules: target.rules as TargetAttributeRules,
          input: accountUser,
          extraAttributes: {
            templates,
            branchingSelections,
            audiences,
          },
          testAll: !!launchReport,
          onDoneChecking: (result) => {
            launchReport?.addMatchLog(
              'template',
              guideBase.createdFromTemplateId || 0,
              result,
              guideBase.createdFromTemplate.name
            );
          },
        });

        if (doesUserMatchTargetedAttributeRules) {
          const guide = await getGuideForGuideBase(guideBase, accountUser);

          guideBasesAdded.add(guideBase.id);

          if (!guide) return;

          return {
            guide,
            templateTargetId:
              target instanceof TemplateTarget ? target.id : null,
          };
        }
      }
    })
  ).filter(Boolean) as { guide: Guide; templateTargetId: number }[];

  const existingGuideParticipants = await GuideParticipant.findAll({
    where: {
      guideId: guidesAndTargets.map((gt) => gt.guide.id),
      accountUserId: accountUser.id,
    },
    attributes: ['guideId'],
    group: 'guideId',
  });

  const existingParticipantGuideIds = existingGuideParticipants.reduce(
    (a, gp) => {
      a.add(gp.guideId);
      return a;
    },
    new Set<number>()
  );

  const guidesAndTargetsWithoutParticipants = guidesAndTargets.filter(
    (gt) => !existingParticipantGuideIds.has(gt.guide.id)
  );

  const guideList: Guide[] = [];

  const gpData = guidesAndTargetsWithoutParticipants.map(
    ({ guide, templateTargetId }) => {
      guideList.push(guide);

      return {
        guideId: guide.id,
        createdFromTemplateTargetId: templateTargetId,
        accountUserId: accountUser.id,
        organizationId: accountUser.organizationId,
      };
    }
  );

  await sequelizeBulkUpsert(GuideParticipant, gpData, {
    upsertOpts: { returning: false },
  });

  return guideList;
}

/**
 * User guides have 1 per user, but if it's an account guide
 *   return the single pre-made one
 */
const getGuideForGuideBase = async (
  guideBase: GuideBase,
  accountUser: AccountUser
): Promise<Guide> => {
  const template = guideBase?.createdFromTemplate
    ? guideBase?.createdFromTemplate
    : await guideBase.$get('createdFromTemplate', { attributes: ['type'] });

  if (!template?.type) {
    throw new Error('Missing template or type associated with guide base');
  }

  if (template.type === GuideTypeEnum.account) {
    let guide = await Guide.findOne({
      where: {
        createdFromGuideBaseId: guideBase.id,
      },
    });

    /** Account guides always need one guide if it is launched */
    if (!guide)
      guide = await createGuideForAccountGuideBase({
        guideBase,
      });

    return guide;
  }

  return await createGuideFromGuideBase({
    guideBase,
    state: GuideState.active,
    launchedAt: new Date(),
    accountUser,
  });
};
