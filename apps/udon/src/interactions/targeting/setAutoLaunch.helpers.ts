import { isSplitTestGuide } from 'bento-common/data/helpers';
import { GroupTargeting } from 'bento-common/types/targeting';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import { User } from 'src/data/models/User.model';
import { setAccountUserTargetsForTemplate } from './setAccountUserTargetsForTemplate';
import { setAccountTargetsForTemplate } from './setAccountTargetsForTemplate';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { invalidateLaunchingCacheForOrg } from 'src/interactions/caching/identifyChecksCache';
import { AttributeRule } from 'src/interactions/targeting/types';
import detachPromise from 'src/utils/detachPromise';
import pauseSplitTestGuideBases from 'src/interactions/library/pauseSplitTestGuideBases';
import propagateSplitTestTargeting from 'src/interactions/library/propagateSplitTestTargeting';
import captureSplitTestGuideAnalytics from 'src/interactions/library/captureSplitTestGuideAnalytics';
import { queueJob } from 'src/jobsBull/queues';
import { JobType } from 'src/jobsBull/job';
import markTargetingSetForTemplate from 'src/interactions/targeting/markTargetingSetForTemplate';
import { setAudiencesForTemplate } from 'src/interactions/targeting/setAudiencesForTemplate';

function convertRules(rules: AttributeRule[]) {
  return rules.map(({ attribute, value, valueType, ruleType }) => ({
    ruleType,
    attribute,
    valueType,
    [`${valueType}Value`]: value,
  }));
}

type Args = {
  /** If loaded without templateTargets/AutoLaunchRules, creates default if targeting also not provided */
  template: Template;
  isAutoLaunchEnabled: boolean;
  onlySetAutolaunchState: boolean;
  targets?: GroupTargeting;
};

type Ctx = {
  organization: Organization;
  user?: User;
};

export default async function setAutoLaunchConfig(
  { template, isAutoLaunchEnabled, onlySetAutolaunchState, targets }: Args,
  { user, organization }: Ctx
) {
  const originalLaunchState = template.isAutoLaunchEnabled;

  const auditContext = new AuditContext({
    type: AuditType.Template,
    modelId: template.id,
    organizationId: organization.id,
    userId: user?.id,
  });

  // Create default rules if needed.
  const shouldCreateDefaultAutoLaunchRules =
    isAutoLaunchEnabled &&
    !targets?.account.groups?.length &&
    !template.templateAutoLaunchRules?.length;

  await setAccountTargetsForTemplate({
    template,
    isAutoLaunchEnabled,
    targeting: targets?.account,
    onlySetAutolaunchState:
      onlySetAutolaunchState && !shouldCreateDefaultAutoLaunchRules,
  });

  // Create default targets if needed.
  const shouldCreateDefaultTargets =
    isAutoLaunchEnabled &&
    !targets?.accountUser.groups?.length &&
    !template.templateTargets?.length;

  if (!onlySetAutolaunchState || shouldCreateDefaultTargets)
    await setAccountUserTargetsForTemplate({
      template,
      targeting: targets?.accountUser,
    });

  if (!onlySetAutolaunchState && targets)
    await setAudiencesForTemplate({
      template,
      targeting: targets.audiences,
    });

  if (isAutoLaunchEnabled !== originalLaunchState) {
    auditContext.logEvent({
      eventName: isAutoLaunchEnabled ? AuditEvent.launched : AuditEvent.paused,
      /** @todo: let's start storing this in full GroupTargeting format so we can do less transformations */
      data: isAutoLaunchEnabled
        ? {
            targets: template.templateTargets.map((target) => ({
              targetType: target.targetType,
              rules: convertRules(target.rules),
            })),
            autoLaunchRules: template.templateAutoLaunchRules.map((rule) => ({
              ruleType: rule.ruleType,
              rules: convertRules(rule.rules),
            })),
          }
        : undefined,
    });
  }

  if (!onlySetAutolaunchState)
    auditContext.logEvent({
      eventName: AuditEvent.autolaunchChanged,
      data: targets,
    });

  await markTargetingSetForTemplate({ template });

  /**
   * invalidates the org cache
   */
  if (isAutoLaunchEnabled) {
    await invalidateLaunchingCacheForOrg(organization, 'setAutoLaunchConfig');

    await queueJob({
      jobType: JobType.RecheckTemplateTargeting,
      organizationId: organization.id,
      templateId: template.id,
    });

    /* Propagate changes to targeted guides of a split test */
    if (isSplitTestGuide(template.type))
      detachPromise(() =>
        propagateSplitTestTargeting({ splitTestTemplate: template })
      ),
        'propagate split test targeting';
  } else {
    /* Stop a split test */
    if (isSplitTestGuide(template.type))
      detachPromise(async () => {
        const splitTestTemplate = template;

        await pauseSplitTestGuideBases({ splitTestTemplate });
        await captureSplitTestGuideAnalytics({ splitTestTemplate });
      }, 'pause split test guide bases');
  }
}
