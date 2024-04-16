import { AtLeast } from 'bento-common/types';
import { Model } from 'sequelize';
import { Loaders } from 'src/data/loaders';
import { TemplateGuideAnalytics } from 'src/data/models/Analytics/CapturedGuideAnalytics.model';
import { GuideData } from 'src/data/models/Analytics/GuideData.model';
import { GuideBase } from 'src/data/models/GuideBase.model';

export type MinimalGuideBaseData = AtLeast<GuideBase, 'guideData'>;

export const getGuideDataFromLoaders = async (
  templateId: number,
  loaders: Loaders
): Promise<MinimalGuideBaseData[]> => {
  const guideData = await loaders.guideDataOfTemplate.load(templateId);

  /* Wrap it in a fake "guideBase" to keep data format consistent */
  return guideData.map((guideData) => ({ guideData }));
};

/** None of the Sqlize junk */
type GuideDataKeys = keyof Omit<GuideData, keyof Model>;

export const aggregateGuideData = (
  guideBases: MinimalGuideBaseData[],
  key: GuideDataKeys
) => guideBases.reduce((a, v) => a + (v.guideData?.[key] || 0), 0);

export const bulkAggregateGuideData = <T extends GuideDataKeys>(
  guideBases: MinimalGuideBaseData[],
  keys: T[]
): Record<T[number], number> =>
  guideBases.reduce((a, v) => {
    keys.forEach((key) => {
      if (!a[key]) a[key] = 0;
      a[key] += v.guideData?.[key] || 0;
    });
    return a;
  }, {} as Record<T[number], number>);

/**
 * Count number of guide bases meeting specified condition
 */
export const countConditionalGuideData = (
  guideBases: MinimalGuideBaseData[],
  condition: (d?: GuideData) => boolean
) => guideBases.reduce((a, v) => a + (condition(v.guideData) ? 1 : 0), 0);

export const mapGuideDataValue = <K extends GuideDataKeys>(
  guideBases: MinimalGuideBaseData[],
  key: K,
  condition?: (v: GuideData[K]) => boolean
): Array<GuideData[K]> =>
  guideBases.reduce((a, v) => {
    if (v.guideData) {
      if (condition && !condition(v.guideData[key])) return a;

      a.push(v.guideData[key]);
    }
    return a;
  }, [] as Array<GuideData[K]>);

/** Empty base object to operate on, to ensure consistent shape */
export const getEmptyAnalytics = (): TemplateGuideAnalytics => ({
  completedAStep: 0,
  usersSeenGuide: 0,
  percentCompleted: 0,
  inputStepAnswersCount: 0,
  guidesViewed: 0,
  usersAnswered: 0,

  /* Announcement and inline contextual only */
  usersDismissed: 0,
  usersClickedCta: 0,
  ctaClickCount: 0 /* @todo deprecate */,
  usersSavedForLater: 0,

  /* Account guide */
  guidesWithCompletedStep: 0,
  percentGuidesCompleted: 0,
  averageStepsCompleted: 0,
  averageStepsCompletedForEngaged: 0,
  accountsSeen: null,
});

/**
 * Ensure we have all the keys so gql won't throw type errors
 */
export const fillInMissingKeys = (stats: Partial<TemplateGuideAnalytics>) => {
  const base = getEmptyAnalytics();

  Object.keys(base).forEach((key) => {
    if (stats[key]) base[key] = stats[key];
  });

  return base;
};
