import promises from 'src/utils/promises';

import { queryRunner } from 'src/data';
import { Template } from 'src/data/models/Template.model';
import { ValueDataAggregate } from 'src/data/models/Analytics/ValueDataAggregate.model';
import {
  combineObjectLists,
  getActiveOrgs,
  getAverage,
  toFixedNumerical,
} from './reports.helpers';
import getAverageWordCountsForTemplates from '../analytics/stats/getAverageWordCountForTemplate';
import getPercentageProgressOfGuideBase from '../analytics/stats/getPercentageProgressOfGuideBase';
import getAverageTimeToCompleteGuideForOrgs from '../analytics/stats/getAverageTimeToCompleteGuideForOrg';
import getNumberStepsOfTemplate from '../analytics/stats/getNumberStepsOfTemplate';
import {
  isBannerGuide,
  isModalGuide,
  isTooltipGuide,
} from 'bento-common/utils/formFactor';

type SupportedTemplateTypes =
  | 'onboarding'
  | 'banner'
  | 'modal'
  | 'tooltip'
  | 'contextual';

export type ValueDataAggregatePayload = {
  averageGuideCompletion?: number;
  averageGuideCompletionTimeInDays?: number;
  averageWordCounts?: Partial<Record<SupportedTemplateTypes, number>>;
  averageStepCounts?: Partial<Record<SupportedTemplateTypes, number>>;
};

const DECIMAL_PLACES = 2;

/** Aggregate stats data across all active orgs */
export default async function generateValueDataAggregate() {
  const activeOrgs = await getActiveOrgs(['id']);
  const activeOrgIds = activeOrgs.map((o) => o.id);

  const stats = [
    getAverageGuideCompletion,
    getAverageStepCount,
    getAverageTimeToComplete,
    getAverageWordCounts,
  ];

  const s: Partial<ValueDataAggregatePayload>[] = [];
  for (const fn of stats) {
    const result = await fn(activeOrgIds);
    s.push(result);
  }

  const valueData: ValueDataAggregatePayload = combineObjectLists(s);

  await ValueDataAggregate.create({
    data: valueData,
  });
}

/** Average % steps completed across all guides */
const getAverageGuideCompletion = async (organizationIds: number[]) => {
  const ret: Partial<ValueDataAggregatePayload> = {
    averageGuideCompletion: 0,
  };

  if (!organizationIds.length) return ret;

  const onboardingGuides = (await queryRunner({
    sql: `--sql
      SELECT
        gb.id
      FROM
        core.guide_bases gb
        JOIN core.templates t ON t.id = gb.created_from_template_id
			WHERE
        gb.organization_id IN (:organizationIds)
        AND t.is_side_quest = FALSE
    `,
    replacements: { organizationIds },
  })) as { id: number }[];

  const onboardingGuideBasesCompletions =
    await getPercentageProgressOfGuideBase(onboardingGuides.map((r) => r.id));

  ret.averageGuideCompletion = toFixedNumerical(
    getAverage(onboardingGuideBasesCompletions),
    DECIMAL_PLACES
  );

  return ret;
};

/** Break templates into list of ids by the template type */
const sortTemplatesByType = (templates: Template[]) => {
  const templateIdsByType: Record<SupportedTemplateTypes, number[]> = {
    onboarding: [],
    banner: [],
    modal: [],
    tooltip: [],
    contextual: [],
  };

  templates.forEach((template) => {
    const { id, formFactor, isSideQuest } = template;
    if (isBannerGuide(formFactor)) {
      templateIdsByType.banner.push(id);
    } else if (isModalGuide(formFactor)) {
      templateIdsByType.modal.push(id);
    } else if (isTooltipGuide(formFactor)) {
      templateIdsByType.tooltip.push(id);
    } else if (isSideQuest) {
      templateIdsByType.contextual.push(id);
    } else if (!isSideQuest) {
      templateIdsByType.onboarding.push(id);
    }
  });

  return templateIdsByType;
};

/** Get avg word count per supported template type */
const getAverageWordCounts = async (organizationIds: number[]) => {
  const orgsTemplates = await Template.findAll({
    where: {
      organizationId: organizationIds,
      isTemplate: false,
    },
    attributes: ['id', 'formFactor', 'isSideQuest'],
  });

  const templateIdsByType = sortTemplatesByType(orgsTemplates);

  const result: Partial<Record<SupportedTemplateTypes, number>> = {};

  await promises.each(Object.keys(templateIdsByType), async (templateType) => {
    const averageWordCounts = await getAverageWordCountsForTemplates(
      templateIdsByType[templateType]
    );
    result[templateType] = toFixedNumerical(
      (await getAverage(averageWordCounts)) || 0,
      DECIMAL_PLACES
    );
  });

  return { averageWordCounts: result } as Partial<ValueDataAggregatePayload>;
};

const getAverageStepCount = async (organizationIds: number[]) => {
  const orgsTemplates = await Template.findAll({
    where: {
      organizationId: organizationIds,
      isTemplate: false,
    },
    attributes: ['id', 'formFactor', 'isSideQuest'],
  });

  const templateIdsByType = sortTemplatesByType(orgsTemplates);

  const result: Partial<Record<SupportedTemplateTypes, number>> = {};

  await promises.each(Object.keys(templateIdsByType), async (templateType) => {
    const stepCounts = await getNumberStepsOfTemplate(
      templateIdsByType[templateType]
    );
    result[templateType] = toFixedNumerical(
      getAverage(stepCounts),
      DECIMAL_PLACES
    );
  });

  return { averageStepCounts: result } as Partial<ValueDataAggregatePayload>;
};

/** Filter out nulls where there is no progress to display */
const getAverageTimeToComplete = async (organizationIds: number[]) => {
  const avgTimes = await getAverageTimeToCompleteGuideForOrgs(organizationIds);

  const numbersOnly = avgTimes.filter((r) => typeof r === 'number') as number[];

  return {
    averageGuideCompletionTimeInDays: toFixedNumerical(
      getAverage(numbersOnly),
      DECIMAL_PLACES
    ),
  } as Partial<ValueDataAggregatePayload>;
};
