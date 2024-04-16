/** Types of rollups we can schedule */
export enum RollupTypeEnum {
  GuideRollups = 'guideRollups',
  /** Daily updates */
  GuideDailyRollups = 'guideDailyRollups',
  AnalyticRollups = 'analyticRollups',
  GuideDataRollups = 'guideDataRollups',
  StepDataRollups = 'stepDataRollups',
  AnnouncementDataRollups = 'announcementDataRollups',
  DataUsageRollups = 'dataUsageRollups',
  TemplateDataRollups = 'templateDataRollups',
}

/** Frequency to run analytics rollup query, in minutes */
export const ANALYTICS_RU_FREQUENCY = 10;

/** Frequency to run guide rollups, in minutes */
export const GUIDE_RU_FREQUENCY = 60;

export const ROLLUP_TIMES_DICT: Record<RollupTypeEnum, number> = {
  [RollupTypeEnum.AnalyticRollups]: ANALYTICS_RU_FREQUENCY,
  [RollupTypeEnum.GuideRollups]: GUIDE_RU_FREQUENCY,
  [RollupTypeEnum.GuideDailyRollups]: 60 * 24,
  [RollupTypeEnum.GuideDataRollups]: GUIDE_RU_FREQUENCY,
  [RollupTypeEnum.StepDataRollups]: GUIDE_RU_FREQUENCY,
  [RollupTypeEnum.AnnouncementDataRollups]: GUIDE_RU_FREQUENCY,
  [RollupTypeEnum.DataUsageRollups]: GUIDE_RU_FREQUENCY,
  [RollupTypeEnum.TemplateDataRollups]: GUIDE_RU_FREQUENCY,
};
