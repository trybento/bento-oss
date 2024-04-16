export enum DeleteLevel {
  /** Target guideBases by which template they belong to */
  Template = 'template',
  /** Target guides by which guideBase they belong to */
  GuideBase = 'guideBase',
  /** Target guides by their account */
  Account = 'account',
  /** Only remove specific guides */
  Guide = 'guide',
}

/**
 * Exclude level options that do not apply to guide base level or above
 */
export type DeleteLevelGuideBase = Exclude<DeleteLevel, DeleteLevel.Guide>;

export enum DeleteStage {
  Guides = 'guides',
  GuideBases = 'guideBases',
  Template = 'template',
  Complete = 'complete',
}

/**
 * Controls how many guides we delete at a time in the
 * deleteGuides job.
 *
 * WARNING: this needs to be kept in sync with the
 * batch size enforced by clearEventsForGuides.
 *
 * @default 20
 */
export const GUIDE_DELETION_GUIDES_BATCH_SIZE = process.env
  .GUIDE_DELETION_GUIDES_BATCH_SIZE
  ? Number(process.env.GUIDE_DELETION_GUIDES_BATCH_SIZE)
  : 20;

/**
 * Controls how many guide bases we delete at a time in the
 * deleteGuides job.
 *
 * @default 10
 */
export const GUIDE_DELETION_GUIDE_BASES_BATCH_SIZE = process.env
  .GUIDE_DELETION_GUIDE_BASES_BATCH_SIZE
  ? Number(process.env.GUIDE_DELETION_GUIDE_BASES_BATCH_SIZE)
  : 10;
