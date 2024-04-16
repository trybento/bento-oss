import promises from 'src/utils/promises';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import captureGuideAnalytics from 'src/interactions/analytics/captureGuideAnalytics';
import withPerfTimer from 'src/utils/perfTimer';
import {
  runGuideDataRollup,
  runGuideRollup,
  runStepRollup,
} from 'src/jobsBull/jobs/rollupTasks/runGuideRollups';
import { updateGuideDataForGuideBase } from './updateGuideData';
import { JobHandler } from 'src/jobsBull/handler';
import { CaptureTemplateAnalyticsJob } from 'src/jobsBull/job';

/** Run rollups in place so we can freeze and capture current state */
const captureTemplateAnalyticsTask: JobHandler<
  CaptureTemplateAnalyticsJob
> = async (job, logger) => {
  const { templateIds } = job.data;

  const templates = await Template.findAll({
    where: { id: templateIds },
    include: [Organization],
  });

  if (!templates.length) return;

  /** Not used, just to avoid ts complications for now */
  const date = new Date().toISOString();

  const ruPayload = { date, templateIds };

  /* Make sure numbers up to date */
  await withPerfTimer(
    'template rollup',
    async () => {
      try {
        /* We expect these not to conflict with normal rollups due to date deduping */
        await runStepRollup(ruPayload);
        await runGuideRollup(ruPayload);
        await runGuideDataRollup(ruPayload);
      } catch (e: any) {
        logger.error(`[captureTemplateAnalytics:rollups] error:`, e);
        console.error(e);
      }
    },
    (time) => {
      const method: keyof typeof logger = time > 10000 ? 'info' : 'debug';

      logger[method](
        `[captureTemplateAnalytics] Took ${time}ms to run template-scoped rollups`,
        job.data
      );
    }
  );

  const affectedGuideBases = await GuideBase.findAll({
    where: {
      createdFromTemplateId: templateIds,
    },
    attributes: ['id'],
  });

  if (affectedGuideBases.length) {
    await promises.map(
      affectedGuideBases,
      async (guideBase) => updateGuideDataForGuideBase(guideBase.id),
      { concurrency: 3 }
    );
  }

  await captureGuideAnalytics({ templates });
};

export default captureTemplateAnalyticsTask;
