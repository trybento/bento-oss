import { GraphQLBoolean, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

import { GuideCategoryEnum } from 'src/graphql/Template/Template.graphql';

import { AccountUser } from 'src/data/models/AccountUser.model';
import { Audience } from 'src/data/models/Audience.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { AttributeRule, TargetAttributeRules } from '../targeting/types';
import { isEqual, keyBy } from 'lodash';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { TemplateTarget } from 'src/data/models/TemplateTarget.model';
import { Template } from 'src/data/models/Template.model';
import { doesAccountMatchAutoLaunchRules } from '../targeting/checkAndAutoLaunchGuideBaseFromTemplates';
import { checkAttributeRulesMatch } from '../targeting/checkAttributeRulesMatch';
import promises from 'src/utils/promises';
import { Account } from 'src/data/models/Account.model';
import { enableBranchingSelectionTargeting } from 'src/utils/features';
import {
  AccountUserTemplateTargetingMetadata,
  excludeExtraAttributeTargeting,
  formatTargeting,
  getBranchingResultsOfAccount,
  getTargetingExtraAttributes,
} from '../targeting/targeting.helpers';
import templateHasActiveGuideBases from '../analytics/stats/templateHasActiveGuideBases';
import { FetchTemplateArgs } from './fetchTemplates';
import { getRuleValue } from 'src/../../common/utils/targeting';

export const FetchTemplateGqlArgs = {
  includeArchived: {
    type: GraphQLBoolean,
  },
  autoLaunchableOnly: {
    type: GraphQLBoolean,
  },
  includeTemplates: {
    type: GraphQLBoolean,
  },
  activeOnly: {
    type: GraphQLBoolean,
  },
  audienceEntityId: {
    type: GraphQLString,
  },
  userEmail: {
    type: GraphQLString,
  },
  category: {
    type: GuideCategoryEnum,
  },
  filters: {
    type: GraphQLJSON,
  },
  search: {
    type: GraphQLString,
  },
};

export type FilteringContext = {
  /* User flight paths */
  accountUser?: AccountUser;
  branchingSelections?: string[];
  branchingPathsByAccountUser?: Record<number, string[]>;
  manuallyLaunchedGuideBasesByTemplateId?: Record<number, GuideBase>;
  templatesByAccountUser?: Record<
    number,
    AccountUserTemplateTargetingMetadata[]
  >;

  /* Audience flight paths */
  audience?: Audience;

  /* Activity filter */
  templateActivityById?: Record<
    number,
    {
      hasActiveGuideBases: boolean;
      hasGuideBases: boolean;
    }
  >;
};

/**
 * Determine if the rules target all users of all accounts
 * Treats no rules set as "all"
 */
const targetsAll = (
  alRules: TemplateAutoLaunchRule[],
  tRules: TemplateTarget[]
) =>
  (alRules.length === 0 || alRules.some((alr) => alr.ruleType === 'all')) &&
  (tRules.length === 0 || tRules.some((tr) => tr.targetType === 'all'));

const defaultRule = [{ ruleType: 'all' }] as TemplateAutoLaunchRule[];

export const mapToAudienceFormat = (rules: AttributeRule[]) =>
  rules.map((rule) => {
    const { valueType, attribute, ruleType } = rule;

    return {
      ruleType,
      attribute,
      valueType,
      value: getRuleValue(rule),
    };
  });

export const audienceFilter = (audience: Audience, template: Template) => {
  if (template.isTemplate) return false;

  const ar = template.templateAutoLaunchRules || [];
  const t = template.templateTargets || [];

  if (targetsAll(ar, t)) return true;

  /* Format value to typeValue and omit rules key for all */
  const alRulesSame = isEqual(
    audience.autoLaunchRules,
    ar.map(({ ruleType, rules }) => ({
      ruleType,
      ...(rules.length ? { rules: mapToAudienceFormat(rules) } : {}),
    }))
  );
  const targetingSame = isEqual(
    audience.targets,
    t.map(({ targetType, rules }) => ({
      targetType,
      ...(rules.length ? { rules: mapToAudienceFormat(rules) } : {}),
    }))
  );

  return alRulesSame && targetingSame;
};

export const userFlightPathFilter = (
  filteringCtx: FilteringContext,
  template: Template
) => {
  const {
    accountUser,
    branchingSelections,
    manuallyLaunchedGuideBasesByTemplateId,
    branchingPathsByAccountUser,
    templatesByAccountUser,
  } = filteringCtx;

  if (!accountUser) return false;

  const formatted = formatTargeting({
    autoLaunchRules: template.templateAutoLaunchRules ?? defaultRule,
  });

  const [matchRules] = doesAccountMatchAutoLaunchRules({
    account: accountUser.account,
    rules: formatted.account,
    extraAttributes: {
      branchingSelections,
    },
  });

  const manuallyLaunchedGuideBase =
    manuallyLaunchedGuideBasesByTemplateId![template.id];

  if (!matchRules && !manuallyLaunchedGuideBase) return false;

  const templates = templatesByAccountUser![accountUser.id] || [];
  const userBranchingSelections =
    branchingPathsByAccountUser![accountUser.id] || [];
  const _targets = template.templateTargets;

  /* Treat no targets as all targets */
  const matchTargeting = _targets
    ? _targets.some((target) =>
        checkAttributeRulesMatch({
          rules: target.rules as TargetAttributeRules,
          input: accountUser,
          extraAttributes: {
            templates,
            branchingSelections: userBranchingSelections,
          },
        })
      )
    : true;

  return matchTargeting;
};

export const activeFilter = (
  filteringCtx: FilteringContext,
  template: Template
) => {
  const { templateActivityById } = filteringCtx;

  if (!templateActivityById) return false;
  const activity = templateActivityById[template.id];

  return (
    activity.hasGuideBases ||
    activity.hasActiveGuideBases ||
    template.isAutoLaunchEnabled
  );
};

/**
 * Gather supplementary data needed for filtering before we begin
 *   What we gather depends what args we specify to prevent extra work
 */
export const fetchFilteringContexts = async (
  {
    userEmail,
    audienceEntityId,
    organizationId,
    activeOnly,
  }: FetchTemplateArgs & { organizationId: number },
  allTemplates: Template[]
) => {
  const ctx: FilteringContext = {};

  await promises.map(
    [
      async () => {
        if (userEmail) {
          const accountUser = await AccountUser.findOne({
            where: {
              email: userEmail,
              organizationId,
            },
            order: [['updatedAt', 'DESC']],
            include: [{ model: Account.scope('notArchived') }],
          });

          if (accountUser) {
            const manuallyLaunchedGuideBases = await GuideBase.findAll({
              where: {
                accountId: accountUser.account.id,
                wasAutoLaunched: false,
              },
              attributes: ['id', 'createdFromTemplateId'],
            });

            const manuallyLaunchedGuideBasesByTemplateId = keyBy(
              manuallyLaunchedGuideBases,
              'createdFromTemplateId'
            );

            const useBranchingTargeting =
              await enableBranchingSelectionTargeting.enabled(organizationId);

            const branchingSelections = useBranchingTargeting
              ? await getBranchingResultsOfAccount({
                  accountId: accountUser.accountId,
                })
              : [];

            const { templatesByAccountUser, branchingPathsByAccountUser } =
              await getTargetingExtraAttributes({
                accountUserIds: [accountUser.id],
                excludes: excludeExtraAttributeTargeting(
                  allTemplates.flatMap((t) => t.templateTargets || [])
                ),
              });

            ctx.accountUser = accountUser;
            ctx.branchingSelections = branchingSelections;
            ctx.branchingPathsByAccountUser = branchingPathsByAccountUser;
            ctx.manuallyLaunchedGuideBasesByTemplateId =
              manuallyLaunchedGuideBasesByTemplateId;
            ctx.templatesByAccountUser = templatesByAccountUser;
          }
        }
      },
      async () => {
        if (audienceEntityId) {
          const audience = await Audience.findOne({
            where: {
              entityId: audienceEntityId,
              organizationId,
            },
          });

          if (audience) ctx.audience = audience;
        }
      },
      async () => {
        if (activeOnly) {
          const templateIds = allTemplates.map((t) => t.id);
          const templateActiveData = await templateHasActiveGuideBases(
            templateIds
          );
          ctx.templateActivityById = templateIds.reduce((a, v, i) => {
            if (templateActiveData[i]) a![v] = templateActiveData[i];
            return a;
          }, {} as FilteringContext['templateActivityById']);
        }
      },
    ],
    (fn) => fn()
  );

  return ctx;
};
