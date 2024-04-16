import {
  TargetingType,
  GuideBaseState,
  TemplateState,
} from 'bento-common/types';
import { GroupTargetingSegment } from 'bento-common/types/targeting';
import AuditContext, { AuditEvent } from 'src/utils/auditContext';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { getPriorityRanking } from '../library/library.helpers';
import { TemplateAutoLaunchRule } from 'src/data/models/TemplateAutoLaunchRule.model';
import { Template } from 'src/data/models/Template.model';
import { withTransaction } from 'src/data';
import { targetingSegmentToLegacy } from './targeting.helpers';

type Args = {
  template: Template;
  targeting?: GroupTargetingSegment;
  onlySetAutolaunchState?: boolean;
  /** Determines audit behaviors and if we toggle state */
  isAutoLaunchEnabled: boolean;
};

type Options = {
  auditContext?: AuditContext;
};

/**
 * When we launch or save rules
 *   Manages only auto launch rules targeting
 */
export async function setAccountTargetsForTemplate(
  { template, isAutoLaunchEnabled, targeting, onlySetAutolaunchState }: Args,
  { auditContext }: Options = {}
): Promise<void> {
  return withTransaction(async () => {
    if (template.isAutoLaunchEnabled !== isAutoLaunchEnabled) {
      auditContext?.logEvent({
        eventName: isAutoLaunchEnabled
          ? AuditEvent.launched
          : AuditEvent.paused,
      });

      await GuideBase.update(
        {
          state: isAutoLaunchEnabled
            ? GuideBaseState.active
            : GuideBaseState.paused,
          ...(isAutoLaunchEnabled ? { excludeFromUserTargeting: false } : {}),
        },
        {
          where: {
            createdFromTemplateId: template.id,
            isModifiedFromTemplate: false,
          },
        }
      );
    }

    const priorityRanking = await getPriorityRanking(
      template,
      isAutoLaunchEnabled
    );

    /**
     * Only toggle state if autoLaunch state has been toggled
     */
    const shouldSetState = template.isAutoLaunchEnabled !== isAutoLaunchEnabled;
    const targetState = isAutoLaunchEnabled
      ? TemplateState.live
      : TemplateState.stopped;

    await template.update({
      isAutoLaunchEnabled,
      priorityRanking,
      // this is only called when manually launching or pausing and in both cases
      // the schedule no longer applies
      enableAutoLaunchAt: null,
      // remove scheduling when pausing
      ...(!isAutoLaunchEnabled && {
        disableAutoLaunchAt: null,
      }),
      ...(shouldSetState &&
        template.state !== targetState && {
          state: targetState,
        }),
    });

    if (onlySetAutolaunchState) {
      return;
    }

    await TemplateAutoLaunchRule.destroy({
      where: {
        templateId: template.id,
        organizationId: template.organizationId,
      },
    });

    if (
      targeting &&
      targeting.type === TargetingType.attributeRules &&
      targeting.groups
    ) {
      await TemplateAutoLaunchRule.bulkCreate(
        targetingSegmentToLegacy(targeting, 'ruleType').map((t) => ({
          ...t,
          organizationId: template.organizationId,
          templateId: template.id,
        }))
      );
    } else {
      await TemplateAutoLaunchRule.create({
        ruleType: TargetingType.all,
        organizationId: template.organizationId,
        templateId: template.id,
      });
    }
  });
}
