import { Nullable, SelectedModelAttrsPick } from 'bento-common/types';
import { GuideBase, GuideBaseScope } from 'src/data/models/GuideBase.model';
import { Module } from 'src/data/models/Module.model';
import { Template } from 'src/data/models/Template.model';
import { propagateGuideBaseChanges } from 'src/jobsBull/jobs/syncTemplateChanges/propagateGuideBaseChanges';
import { propagateModuleChanges } from 'src/jobsBull/jobs/syncTemplateChanges/propagateModuleChanges';
import { propagateTemplateChanges } from 'src/jobsBull/jobs/syncTemplateChanges/propagateTemplateChanges';
import {
  SYNC_JOB_GUIDE_BASE_BATCH_SIZE,
  SYNC_JOB_GUIDE_BATCH_SIZE,
} from './syncChanges.helpers';
import { JobHandler } from 'src/jobsBull/handler';
import { SyncTemplateChangesJob } from 'src/jobsBull/job';
import { Logger } from 'src/jobsBull/logger';
import { queueJob } from 'src/jobsBull/queues';
import { enableDeferredPropagation } from 'src/utils/features';
import { withOffHoursRequeue } from 'src/jobsBull/workerBull.helpers';
import {
  Organization,
  OrganizationModelScope,
} from 'src/data/models/Organization.model';

const handleJob = async (data: SyncTemplateChangesJob, logger: Logger) => {
  logger.info(
    `[syncTemplateChanges] Called with params: ${JSON.stringify(data)}`
  );

  const organization = (await Organization.scope(
    OrganizationModelScope.active
  ).findByPk(data.organizationId, {
    attributes: ['id', 'slug'],
  })) as SelectedModelAttrsPick<Organization, 'id' | 'slug'>;

  if (!organization) {
    logger.warn(`Called with invalid organizationId: ${data.organizationId}`);
    return;
  }

  switch (data.type) {
    case 'template': {
      const template = await Template.findByPk(data.templateId);
      if (!template) {
        logger.warn(`Called with invalid templateId: ${data.templateId}`);
        return;
      }
      const [newLastId, syncedCount] = await propagateTemplateChanges({
        template,
        lastGuideBaseId: data.lastGuideBaseId,
      });

      const doneWithThisTemplatesGbs =
        syncedCount === 0 || syncedCount < SYNC_JOB_GUIDE_BASE_BATCH_SIZE;

      /** We synced n/n so there might be more, re-queue and re-check */
      if (!doneWithThisTemplatesGbs)
        await queueJob({
          ...data,
          lastGuideBaseId: newLastId,
        });

      return;
    }

    case 'module': {
      const module = await Module.findByPk(data.moduleId);
      if (!module) {
        logger.warn(`Called with invalid moduleId: ${data.moduleId}`);
        return;
      }

      await propagateModuleChanges({
        module,
        skipTemplateId: data.skipTemplateId,
      });

      return;
    }

    case 'guideBase': {
      const guideBase = (await GuideBase.scope({
        method: [
          GuideBaseScope.withTemplate,
          {
            attributes: ['type', 'theme'],
          },
        ],
      }).findByPk(data.guideBaseId)) as Nullable<
        GuideBase & {
          createdFromTemplate: SelectedModelAttrsPick<
            Template,
            'type' | 'theme'
          >;
        }
      >;

      if (!guideBase) {
        logger.warn(`Called with invalid guideBaseId: ${data.guideBaseId}`);
        return;
      }

      const [newLastId, syncedCount] = await propagateGuideBaseChanges({
        guideBase,
        lastGuideId: data.lastGuideId,
        logger,
      });

      /* If we did nothing or did less than the limit, we're done here */
      const doneWithThisGbsGuides =
        syncedCount === 0 || syncedCount < SYNC_JOB_GUIDE_BATCH_SIZE;

      if (doneWithThisGbsGuides) {
        logger.info(`Done with guideBaseId: ${guideBase.id}`);
        return;
      }

      /** We synced n/n so there might be more, re-queue and re-check */
      await queueJob({
        ...data,
        lastGuideId: newLastId,
      });
    }
  }
};

const handler: JobHandler<SyncTemplateChangesJob> = async (job, logger) => {
  const organizationId = job.data.organizationId;

  const defer = await enableDeferredPropagation.enabled(organizationId);

  await withOffHoursRequeue({ job, override: !defer }, () =>
    handleJob(job.data, logger)
  );
};

export default handler;
