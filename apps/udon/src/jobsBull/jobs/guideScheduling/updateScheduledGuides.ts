import { InferCreationAttributes, Op, Sequelize } from 'sequelize';
import { TemplateState } from 'bento-common/types';
import { Template } from 'src/data/models/Template.model';
import AuditContext, { AuditEvent, AuditType } from 'src/utils/auditContext';
import { invalidateLaunchingCacheForOrgs } from 'src/interactions/caching/identifyChecksCache';
import { enableGuideSchedulingThrottling } from 'src/utils/features';
import { JobHandler } from 'src/jobsBull/handler';
import { JobType, UpdateScheduledGuidesJob } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';

export const updateScheduledGuides = async (logger: Logger) => {
  // This will rarely be a large array (i.e., more than a few hundred rows), but if we ever start
  // reaching a point where this array is long we can break this up into chunks.
  const templatesToUpdate = await Template.findAll({
    where: {
      [Op.or]: [
        {
          enableAutoLaunchAt: { [Op.lte]: Sequelize.fn('now') },
          disableAutoLaunchAt: {
            [Op.or]: { [Op.is]: null, [Op.gt]: Sequelize.fn('now') },
          },
          isAutoLaunchEnabled: false,
        },
        {
          disableAutoLaunchAt: { [Op.lte]: Sequelize.fn('now') },
          isAutoLaunchEnabled: true,
        },
      ],
    },
    raw: true,
  });

  const orgsToInvalidateCacheFor = new Set<number>();

  if (templatesToUpdate.length) {
    const countEnabled = templatesToUpdate.reduce(
      (count, tmpl) => count + (tmpl.isAutoLaunchEnabled ? 1 : 0),
      0
    );
    logger.debug(
      `Found templates to update auto-launch status: ${
        templatesToUpdate.length - countEnabled
      } to enable, ${countEnabled} to disable`
    );

    const templateUpdateData: InferCreationAttributes<Template>[] = [];
    const templatesToPrelaunch: {
      templateId: number;
      organizationId: number;
    }[] = [];
    const templatesToPause: number[] = [];

    for (const template of templatesToUpdate) {
      const auditContext = new AuditContext({
        type: AuditType.Template,
        modelId: template.id,
        organizationId: template.organizationId,
        isSystem: true,
      });

      const shouldEnableAutoLaunch = !template.isAutoLaunchEnabled;

      templateUpdateData.push({
        ...template,
        isAutoLaunchEnabled: shouldEnableAutoLaunch,
        ...(!shouldEnableAutoLaunch
          ? {
              enableAutoLaunchAt: null,
              disableAutoLaunchAt: null,
              state: TemplateState.stopped,
            }
          : {
              state: TemplateState.live,
            }),
      });

      const throttlingEnabled = await enableGuideSchedulingThrottling.enabled(
        template.organizationId
      );

      if (shouldEnableAutoLaunch) {
        if (throttlingEnabled) {
          templatesToPrelaunch.push({
            templateId: template.id,
            organizationId: template.organizationId,
          });
        }
      } else {
        // when pausing we don't care if the scheduling throttling is enabled or
        // not since in both cases the guide should no longer be launched to
        // any new users
        templatesToPause.push(template.id);
      }
      orgsToInvalidateCacheFor.add(template.organizationId);

      auditContext.logEvent({
        eventName: shouldEnableAutoLaunch
          ? AuditEvent.launched
          : AuditEvent.paused,
      });
    }

    if (templateUpdateData.length > 0) {
      await Template.bulkCreate(templateUpdateData, {
        updateOnDuplicate: [
          'isAutoLaunchEnabled',
          'enableAutoLaunchAt',
          'disableAutoLaunchAt',
          'state',
        ],
        returning: false,
      });
    }

    if (templatesToPrelaunch.length > 0) {
      await queueJob({
        jobType: JobType.PrelaunchScheduledGuide,
        templatesAndOrgs: templatesToPrelaunch,
      });
    }

    if (templatesToPause.length > 0) {
      await queueJob({
        jobType: JobType.CleanupScheduledGuide,
        templateIds: templatesToPause,
      });
    }

    if (orgsToInvalidateCacheFor.size > 0) {
      /**
       * invalidates the org cache
       */
      await invalidateLaunchingCacheForOrgs([...orgsToInvalidateCacheFor]);
    }
  } else {
    logger.debug('No scheduled templates found to update');
  }
};

const handler: JobHandler<UpdateScheduledGuidesJob> = async (_, logger) => {
  await updateScheduledGuides(logger);
};

export default handler;
