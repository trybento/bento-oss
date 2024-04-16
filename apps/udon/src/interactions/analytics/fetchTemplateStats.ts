import { GuideDesignType, GuideFormFactor } from 'bento-common/types';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';

import { Account } from 'src/data/models/Account.model';
import { getAverage } from '../reporting/reports.helpers';
import { logger } from 'src/utils/logger';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import {
  CapturedGuideAnalytics,
  TemplateGuideAnalytics,
} from 'src/data/models/Analytics/CapturedGuideAnalytics.model';
import { Loaders } from 'src/data/loaders';
import {
  aggregateGuideData,
  bulkAggregateGuideData,
  countConditionalGuideData,
  fillInMissingKeys,
  getEmptyAnalytics,
  mapGuideDataValue,
} from './fetchTemplateStats.helpers';
import { createPartition } from 'src/utils/helpers';
import { TemplateData } from 'src/data/models/Analytics/TemplateData.model';
import { isTooltipGuide } from 'bento-common/utils/formFactor';
import { QueryDatabase, queryRunner } from 'src/data';

type Args = {
  template: Template;
  useLocked?: boolean;

  loaders?: Loaders;
  allowCached?: boolean;
};

/**
 * Fetches Guide Analytics, taking into account any potential
 *   caching mechanism. Should re-use loaders where possible
 *   to keep the data aggregration methods consistent.
 */
export default async function fetchTemplateStats({
  template,
  useLocked = false,
  allowCached = false,
  loaders,
}: Args): Promise<TemplateGuideAnalytics> {
  if (useLocked) {
    const capturedAnalytics = await CapturedGuideAnalytics.findOne({
      where: {
        templateId: template.id,
      },
      order: [['createdAt', 'DESC']],
    });

    if (capturedAnalytics) return fillInMissingKeys(capturedAnalytics.stats);
  }

  if (allowCached) {
    const templateData = await TemplateData.findOne({
      where: {
        templateId: template.id,
      },
    });

    if (templateData) return fillInMissingKeys(templateData.stats);
  }

  const results: TemplateGuideAnalytics = getEmptyAnalytics();

  try {
    const guideBases = await GuideBase.findAll({
      where: {
        createdFromTemplateId: template.id,
      },
      include: [
        {
          model: Account.scope('notArchived'),
          attributes: [],
        },
        {
          model: GuideData,
        },
      ],
      attributes: ['id', 'isModifiedFromTemplate'],
    });

    if (guideBases.length === 0) return results;

    /* The current % is based on guide count. see `getPercentageGuidesCompletedOfTemplates` */
    const numGuides = loaders
      ? await loaders.numberGuidesOfTemplate.load(template.id)
      : await countGuides(template.id);

    if (numGuides === 0) return results;

    /* If we use guides with views as denominator, we can even skip counting above */
    results.percentCompleted =
      numGuides === 0
        ? 0
        : +(
            aggregateGuideData(guideBases, 'guidesCompleted') / numGuides
          ).toFixed(2);

    results.completedAStep = aggregateGuideData(
      guideBases,
      'usersCompletedAStep'
    );
    results.guidesViewed = aggregateGuideData(guideBases, 'guidesViewed');
    results.usersSeenGuide = aggregateGuideData(guideBases, 'usersViewedAStep');
    results.usersAnswered = aggregateGuideData(guideBases, 'usersAnswered');

    /*
     * Stats originally for account guides
     */

    results.guidesWithCompletedStep = countConditionalGuideData(
      guideBases,
      (guideData) => (guideData?.avgStepsCompleted || 0) > 0
    );

    /** Only consider guide bases that have views for completion % */
    const guideBasesWithViews = guideBases.filter(
      (gb) =>
        gb.guideData?.participantsWhoViewed &&
        gb.guideData.participantsWhoViewed > 0
    );

    const unmodifiedAndViewedGbs = guideBasesWithViews.filter(
      (gb) => !gb.isModifiedFromTemplate
    );

    /** Avg steps completed for guide bases with progress in refresh */
    results.averageStepsCompleted = +(
      getAverage(
        mapGuideDataValue(guideBasesWithViews, 'avgStepsCompleted') as number[]
      ).toFixed(1) || 0
    );

    results.averageStepsCompletedForEngaged = Math.ceil(
      +(
        getAverage(
          mapGuideDataValue(
            unmodifiedAndViewedGbs,
            'avgStepsCompleted',
            (n) => !!n && n > 0
          ) as number[]
        ).toFixed(1) || 0
      )
    );

    await createPartition();

    const completionPercents = unmodifiedAndViewedGbs.map(
      (gb) => gb.guideData?.avgProgress || 0
    );

    results.percentGuidesCompleted = unmodifiedAndViewedGbs.length
      ? (completionPercents.reduce((a, v) => (v === 100 ? a + 1 : a), 0) /
          unmodifiedAndViewedGbs.length) *
        100
      : 0;

    /*
     * Stats specific to announcements and inlines
     */
    if (
      template.designType === GuideDesignType.announcement ||
      isTooltipGuide(template.formFactor) ||
      (template.formFactor === GuideFormFactor.inline && template.isSideQuest)
    ) {
      const { savedForLater, usersClickedCta, usersSkippedAStep } =
        bulkAggregateGuideData(guideBases, [
          'usersClickedCta',
          'usersSkippedAStep',
          'savedForLater',
        ]);

      results.usersClickedCta = usersClickedCta;
      results.usersDismissed = usersSkippedAStep;
      results.usersSavedForLater = savedForLater;
    }
  } catch (e) {
    logger.error(`[fetchTemplateStats] error fetching stats`, e);
  }

  return results;
}

const countGuides = async (templateId: number) => {
  const rows = await queryRunner<{ count: number }[]>({
    sql: `--sql	
			SELECT COUNT(*)
			FROM core.guides g
			WHERE
				g.created_From_template_id = :templateId
				AND g.deleted_at IS NULL
		`,
    replacements: {
      templateId,
    },
    queryDatabase: QueryDatabase.follower,
  });

  return rows?.[0].count ?? 0;
};
