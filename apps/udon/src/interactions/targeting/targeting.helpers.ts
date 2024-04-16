import { keyBy } from 'lodash';

import {
  AutolaunchRulesData,
  AutolaunchTargetsData,
  GroupTargeting,
  GroupTargetingSegment,
  RawRule,
} from 'bento-common/types/targeting';
import {
  AttributeType,
  FeatureFlagNames,
  GuideCompletionState,
  SelectedModelAttrs,
  TargetingType,
  TargetValueType,
} from 'bento-common/types';
import {
  audienceRuleToAudience,
  AUDIENCE_ATTR_NAME,
  emptyTargeting,
  formatTargetingSegment,
  targetingRuleRowsToTargetingSegment,
  turnEverythingIntoValue,
} from 'bento-common/utils/targeting';
import { CheckResults } from 'bento-common/types/diagnostics';

import promises from 'src/utils/promises';
import { QueryDatabase, queryRunner } from 'src/data';
import { BranchingPath } from 'src/data/models/BranchingPath.model';
import { TriggeredBranchingPath } from 'src/data/models/TriggeredBranchingPath.model';
import { enableBranchingSelectionTargeting } from 'src/utils/features';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateAudience } from 'src/data/models/TemplateAudience.model';
import { AttributeRule } from './types';
import { HARD_EXCLUDE_BRANCHING_TARGETING } from 'src/utils/constants';
import { formatTargetRulesFromArgs } from './formatTargetRulesFromArgs';
import { Audience } from 'src/data/models/Audience.model';
import { Template } from 'src/data/models/Template.model';

/** Audiences are a special category of rule; fill out default necessary information */
const templateAudienceToRuleRows = (
  templateAudiences: SelectedModelAttrs<
    TemplateAudience,
    'audienceEntityId' | 'ruleType' | 'groupIndex'
  >[]
): GroupTargetingSegment =>
  targetingRuleRowsToTargetingSegment(
    templateAudiences.map((a) => ({
      groupIndex: a.groupIndex,
      value: a.audienceEntityId,
      valueType: TargetValueType.audience,
      ruleType: a.ruleType,
      attribute: AUDIENCE_ATTR_NAME,
    }))
  );

type RuleArgResult<T extends 'ruleType' | 'targetType'> = T extends 'targetType'
  ? AutolaunchTargetsData<RawRule>[]
  : AutolaunchRulesData<RawRule>[];

/**
 * Reformats GroupTargeting to legacy format
 * @todo fix typings to reduce need to cast
 */
export const targetingSegmentToLegacy = <T extends 'ruleType' | 'targetType'>(
  segment: GroupTargetingSegment,
  key: T
): RuleArgResult<T> =>
  (segment.groups && segment.type === TargetingType.attributeRules
    ? segment.groups.map((g) => ({
        [key]: TargetingType.attributeRules,
        rules: formatTargetRulesFromArgs(g.rules),
      }))
    : [
        {
          [key]: TargetingType.all,
        },
      ]) as unknown as RuleArgResult<T>;

/**
 * Reformats legacy targeting rule to GroupTargeting
 * Not passing in a segment will default it to "all" rules
 */
export const formatTargeting = ({
  autoLaunchRules = [],
  templateTargets = [],
  templateAudiences = [],
  transformLegacy,
}: {
  autoLaunchRules?: SelectedModelAttrs<
    TemplateAutoLaunchRule,
    'rules' | 'ruleType'
  >[];
  templateTargets?: SelectedModelAttrs<
    TemplateTarget,
    'rules' | 'targetType'
  >[];
  templateAudiences?: SelectedModelAttrs<
    TemplateAudience,
    'ruleType' | 'groupIndex' | 'audienceEntityId'
  >[];
  /** Legacy formats store values in their own typed keys and may need transformation. */
  transformLegacy?: boolean;
}): GroupTargeting<RawRule> => ({
  account: formatTargetingSegment(autoLaunchRules, transformLegacy),
  accountUser: formatTargetingSegment(templateTargets, transformLegacy),
  audiences: templateAudiences.length
    ? templateAudienceToRuleRows(templateAudiences)
    : undefined,
});

type ExtraAttributes = {
  templates?: boolean;
  branching?: boolean;
  audiences?: boolean;
};

/**
 * Extra attributes are Bento properties used for targeting.
 */
export type ExtraAttributeDict = {
  /** For launching based on previous guide activity */
  templates?: AccountUserTemplateTargetingMetadata[];
  /** For launching based on branching selections */
  branchingSelections?: string[];
  /** For matching GroupTargeting.audience type rules */
  audiences?: Record<string, GroupTargeting<AttributeRule>>;
  /** Informs which part of audiences to check against, if audiences are used */
  attrType?: AttributeType;
};

export const excludeExtraAttributeTargeting = (
  templateTargets:
    | GroupTargetingSegment<AttributeRule>['groups']
    | TemplateTarget[]
) => {
  const result = {
    templates: true,
    branching: true,
  };

  if (!templateTargets) return result;

  for (let i = 0; i < templateTargets.length; i++) {
    const gt = templateTargets[i];
    /* Only check if we haven't yet found */
    if (result.templates)
      result.templates =
        gt.rules?.every(
          (rule) => rule.valueType !== TargetValueType.template
        ) ?? true;

    if (result.branching)
      result.branching =
        gt.rules?.every(
          (rule) => rule.valueType !== TargetValueType.branchingPath
        ) ?? true;

    if (!result.branching && !result.templates) break;
  }

  return result;
};

export type RuleMatchLog<T = CheckResults> = {
  matchedRules: T[];
  failedRules: T[];
};

export const addResultToMatchLog = (
  matched: boolean,
  results: CheckResults[],
  matchResults: RuleMatchLog
) =>
  matched
    ? matchResults.matchedRules.push(...results)
    : matchResults.failedRules.push(...results);

export type AccountUserTemplateTargetingMetadata = {
  templateEntityId: string;
  completed: boolean;
};

export const getAudiencesForOrgs = async (orgIds: number[]) => {
  const all = await Audience.findAll({
    where: {
      organizationId: orgIds,
    },
  });

  return all.reduce<
    Record<number, Record<string, GroupTargeting<AttributeRule>>>
  >((a, v) => {
    if (!a[v.organizationId]) a[v.organizationId] = {};

    a[v.organizationId][v.entityId] = formatTargeting({
      autoLaunchRules: v.autoLaunchRules as TemplateAutoLaunchRule[],
      templateTargets: v.targets as TemplateTarget[],
      transformLegacy: true,
    });

    return a;
  }, {});
};

/**
 * Return a hash of audiences in GroupTargeting form for an org,
 *   so that we can match against it in rules checking.
 */
export const getAudiencesForOrg = async (orgId: number) => {
  const allAudiences = await getAudiencesForOrgs([orgId]);

  return allAudiences[orgId] ?? {};
};

/**
 * Gets additional information needed to determine user targeting
 */
export const getTargetingExtraAttributes = async ({
  accountUserIds,
  excludes = {},
  organizationId,
}: {
  accountUserIds: number[];
  /** Use to skip querying for additional data */
  excludes?: ExtraAttributes;
  organizationId?: number;
}): Promise<{
  templatesByAccountUser: Record<
    number,
    AccountUserTemplateTargetingMetadata[]
  >;
  branchingPathsByAccountUser: Record<number, string[]>;
  audiences: Record<string, GroupTargeting<AttributeRule>>;
}> => {
  let templatesByAccountUser: Record<
    number,
    AccountUserTemplateTargetingMetadata[]
  > = {};
  let branchingPathsByAccountUser: Record<number, string[]> = {};
  let audiences: Record<string, GroupTargeting<AttributeRule>> = {};

  // no need to check if no ids were provided
  if (accountUserIds.length === 0) {
    return {
      templatesByAccountUser,
      branchingPathsByAccountUser,
      audiences,
    };
  }

  if (!excludes.audiences && organizationId) {
    const audienceHash = await getAudiencesForOrgs([organizationId]);

    audiences = audienceHash[organizationId];
  }

  // find all template ids for all users
  if (!excludes.templates) {
    const templateIds = await queryRunner<
      {
        account_user_id: number;
        template_entity_id: string;
        completed: boolean;
      }[]
    >({
      sql: `--sql
        select
          au.id account_user_id,
          t.entity_id as template_entity_id,
          CASE
            WHEN g.completion_state = '${GuideCompletionState.complete}'::core.guide_completion_state THEN TRUE
            ELSE FALSE
          END as completed
        from core.account_users au
        join core.guide_participants gp
          on (au.id = gp.account_user_id)
        join core.guides g
          on (gp.guide_id = g.id)
        join core.templates t
          on (g.created_from_template_id = t.id)
        where au.id in (:account_user_ids)
      `,
      replacements: {
        account_user_ids: accountUserIds,
      },
      queryDatabase: QueryDatabase.primary,
    });

    templatesByAccountUser = templateIds?.reduce<
      Record<number, AccountUserTemplateTargetingMetadata[]>
    >((a, { account_user_id, template_entity_id, completed }) => {
      a[account_user_id]
        ? a[account_user_id].push({
            templateEntityId: template_entity_id,
            completed,
          })
        : (a[account_user_id] = [
            { templateEntityId: template_entity_id, completed },
          ]);
      return a;
    }, {});
  }

  if (!excludes.branching && !HARD_EXCLUDE_BRANCHING_TARGETING) {
    /* Branching paths these users have selected */
    const allTriggeredBranchingPaths = await TriggeredBranchingPath.findAll({
      where: {
        accountUserId: accountUserIds,
      },
      attributes: ['accountUserId', 'organizationId'],
      include: [{ model: BranchingPath, attributes: ['entityId'] }],
    });

    branchingPathsByAccountUser = await promises.reduce(
      allTriggeredBranchingPaths,
      async (a, tbp) => {
        if (tbp?.branchingPath) {
          const enabled = await enableBranchingSelectionTargeting.enabled(
            tbp.organizationId
          );
          if (enabled) {
            a[tbp.accountUserId]
              ? a[tbp.accountUserId].push(tbp.branchingPath.entityId)
              : (a[tbp.accountUserId] = [tbp.branchingPath.entityId]);
          }
        }

        return a;
      },
      {} as Record<number, string[]>
    );
  }

  return {
    templatesByAccountUser,
    branchingPathsByAccountUser,
    audiences,
  };
};

/**
 * Get all the branching path IDs of an account for branching selection matching
 */
export const getBranchingResultsOfAccount = async ({
  accountId,
}: {
  accountId: number;
}) => {
  const rows = (await queryRunner({
    sql: `--sql
			SELECT bp.entity_id FROM core.triggered_branching_paths tbp
			JOIN core.branching_paths bp ON tbp.branching_path_id = bp.id
			JOIN core.account_users au ON tbp.account_user_id = au.id
			WHERE au.account_id = :accountId
		`,
    replacements: {
      accountId,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { entity_id: string }[];

  return rows.map((r) => r.entity_id);
};

type BranchingResults<B> = B extends true
  ? Record<number, string[]>
  : string[][];

/**
 * Fetches all branching results for a given set of account ids.
 *
 * WARNING: Will only return results if the associated feature flag enabled for the Org.
 */
export const getBranchingResultsOfAccounts = async <B extends boolean>(
  accountIds: number[],
  useHash?: B
): Promise<BranchingResults<B>> => {
  const rows = (await queryRunner({
    sql: `--sql
      SELECT
        bp.entity_id "entityId",
        au.account_id "accountId"
      FROM
        core.triggered_branching_paths tbp
        JOIN core.branching_paths bp ON tbp.branching_path_id = bp.id
        JOIN core.account_users au ON tbp.account_user_id = au.id
        JOIN core.feature_flags ff ON ff.name = :featureFlag
        LEFT JOIN core.feature_flag_enabled ffe
          ON (
            ffe.feature_flag_id = ff.id
            AND ffe.organization_id = au.organization_id
          )
      WHERE
        au.account_id in (:accountIds)
        AND (
          ff.enabled_for_all = true -- meaning is enabled for all orgs
          OR ffe.id IS NOT NULL -- meaning is enabled for org
        )
    `,
    replacements: {
      accountIds: [...new Set(accountIds)],
      featureFlag: FeatureFlagNames.branchingSelectionTargeting,
    },
    queryDatabase: QueryDatabase.primary,
  })) as { entityId: string; accountId: number }[];

  if (useHash) {
    return <BranchingResults<B>>rows.reduce((a, r) => {
      if (!a[r.accountId]) a[r.accountId] = [];
      a[r.accountId].push(r.entityId);
      return a;
    }, {} as Record<number, string[]>);
  }

  return accountIds.map((accountId) =>
    rows.filter((r) => r.accountId === accountId)?.map((r) => r.entityId)
  ) as string[][];
};

/**
 * Gets relevant targeting information and format to GroupTargeting type
 */
export const getTargetingForTemplates = async (
  templateIds: number[],
  excludes?: Record<keyof GroupTargeting, boolean>
) => {
  const templates = await Template.findAll({
    where: {
      id: templateIds,
    },
    include: [
      ...(excludes?.account ? [] : [TemplateAutoLaunchRule]),
      ...(excludes?.accountUser ? [] : [TemplateTarget]),
      ...(excludes?.audiences ? [] : [TemplateAudience]),
    ],
  });

  const templatesByIds = keyBy(templates, 'id');

  return templateIds.reduce<Record<number, GroupTargeting<AttributeRule>>>(
    (a, tId) => {
      const template = templatesByIds[tId];

      if (!template) {
        a[tId] = emptyTargeting;
      } else {
        a[tId] = formatTargeting({
          autoLaunchRules: template.templateAutoLaunchRules ?? [],
          templateTargets: template.templateTargets ?? [],
          templateAudiences: template.templateAudiences ?? [],
        });
      }

      return a;
    },
    {}
  );
};

/**
 * Mini shortcut to getTargetingForTemplates which loads a single template
 */
export const getTargetingForTemplate = async (templateId: number) =>
  (await getTargetingForTemplates([templateId]))[templateId];

/**
 * Get targeting rules for a template, including audience rules if applicable
 *
 * Only applicable for v2.0 audiences when templates only have one audience.
 */
export const getTargetingForTemplateWithAudience = async (
  templateId: number
) => {
  const targets = (await getTargetingForTemplate(
    templateId
  )) as GroupTargeting<RawRule>;

  if (targets.audiences) {
    const audienceEntityId = audienceRuleToAudience(targets.audiences);

    if (!audienceEntityId) return targets;

    const audience = (await Audience.findOne({
      where: {
        entityId: audienceEntityId,
      },
      attributes: ['autoLaunchRules', 'targets'],
    })) as SelectedModelAttrs<Audience, 'autoLaunchRules' | 'targets'>;

    if (audience)
      return formatTargeting({
        autoLaunchRules: audience.autoLaunchRules as TemplateAutoLaunchRule[],
        templateTargets: audience.targets as TemplateTarget[],
        transformLegacy: true,
      });
  }

  return targets;
};
