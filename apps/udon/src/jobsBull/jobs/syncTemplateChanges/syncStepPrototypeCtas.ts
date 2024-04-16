import { withTransaction } from 'src/data';
import { CreationAttributes } from 'sequelize';
import { chunk } from 'lodash';
import { SelectedModelAttrs } from 'bento-common/types';

import {
  GuideBaseStepModelScope,
  GuideStepBase,
  GuideStepBaseWithCtas,
} from 'src/data/models/GuideStepBase.model';
import { GuideBaseStepCta } from 'src/data/models/GuideBaseStepCta.model';
import { StepPrototypeCta } from 'src/data/models/StepPrototypeCta.model';
import { Logger } from 'src/jobsBull/logger';
import { SyncStepPrototypeCtasJob } from 'src/jobsBull/job';
import { JobHandler } from 'src/jobsBull/handler';
import promises from 'src/utils/promises';
import { queueJob } from 'src/jobsBull/queues';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';

/**
 * Determines how many GuideBaseSteps to sync at once, for each we will
 * sync their CTA instances based on the associated StepPrototype.
 */
const SYNC_CTA_CHUNK_SIZE = process.env.SYNC_CTA_CHUNK_SIZE
  ? Number(process.env.SYNC_CTA_CHUNK_SIZE)
  : 200;

/**
 * Sync the CTAs of a given StepPrototype to GuideStepBase instances while
 * removing any orphaned instances.
 *
 * @todo remove after D+1
 * @deprecated queue a SyncTemplateChanges job instead
 */
const handleJob = async (payload: SyncStepPrototypeCtasJob, logger: Logger) =>
  withTransaction(async () => {
    const { organizationId, stepPrototypeId, guideStepBaseIds } = payload;

    logger.debug(`[syncStepPrototypeCtas] syncing sp.id ${stepPrototypeId}`);

    /* No ids, spawn chunked jobs */
    if (!guideStepBaseIds) {
      const guideBaseSteps = await GuideStepBase.findAll({
        where: {
          createdFromStepPrototypeId: stepPrototypeId,
        },
        attributes: ['id'],
      });

      logger.debug(
        `[syncStepPrototypeCtas] chunking ${guideBaseSteps.length} rows`
      );

      await promises.each(chunk(guideBaseSteps, SYNC_CTA_CHUNK_SIZE), (chunk) =>
        queueJob({
          ...payload,
          guideStepBaseIds: chunk.map((gsb) => gsb.id),
        })
      );

      return;
    }

    const guideBaseSteps = (await GuideStepBase.scope(
      GuideBaseStepModelScope.withCtas
    ).findAll({
      attributes: ['id'],
      where: { id: guideStepBaseIds },
    })) as Array<
      GuideStepBaseWithCtas<SelectedModelAttrs<GuideStepBase, 'id'>>
    >;

    const stepPrototypeCtas = await StepPrototypeCta.findAll({
      where: { stepPrototypeId: stepPrototypeId },
    });

    const ctaUpsertData = guideBaseSteps.reduce<
      CreationAttributes<GuideBaseStepCta>[]
    >((acc, gbs) => {
      stepPrototypeCtas.forEach((stepPrototypeCta) => {
        const guideBaseStepCta = gbs.ctas.find(
          (cta) => cta.createdFromStepPrototypeCtaId === stepPrototypeCta.id
        );

        // wont unnecessarily update existing instances
        if (!guideBaseStepCta) {
          acc.push({
            organizationId,
            guideBaseStepId: gbs.id,
            createdFromStepPrototypeCtaId: stepPrototypeCta.id,
          });
        }
      });

      return acc;
    }, []);

    await sequelizeBulkUpsert(GuideBaseStepCta, ctaUpsertData, {
      onError: (e, _ctaData) => {
        /* Let it fail normally */
        throw e;
      },
    });
  });

const handler: JobHandler<SyncStepPrototypeCtasJob> = async (job, logger) => {
  await handleJob(job.data, logger);
};

export default handler;
