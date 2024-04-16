import { Account } from 'src/data/models/Account.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { Template } from 'src/data/models/Template.model';
import { ResetGuidesForGuideBasesJob, ResetGuidesJob } from 'src/jobsBull/job';

export enum ResetLevel {
  Template = 'template',
  Account = 'account',
  GuideBase = 'guide_base',
}

/**
 * Controls how many guide bases we retrieve from the DB
 * at a time in the resetGuides job. We can afford to do less
 * round trips when fetching guide bases from the DB, as we
 * only retrieve a list of IDs.
 */
export const RESET_GUIDES_DB_BATCH_SIZE = 1000;

/**
 * Controls how many guide bases we queue for reset at a
 * time in the resetGuides job. This should generally be
 * much smaller than the DB batch size, as the reset logic
 * for guide bases can be heavy.
 *
 * Note that the resetGuidesForGuideBases job will further
 * batch resets on a guide level.
 */
export const RESET_GUIDES_QUEUE_BATCH_SIZE = 100;

/**
 * Controls how many guides we reset at a time in the
 * resetGuidesForGuideBases jobs.
 *
 * WARNING: this needs to be kept in sync with the
 * batch size enforced by clearEventsForGuides.
 */
export const RESET_GUIDES_FOR_GUIDE_BASE_BATCH_SIZE = 100;

export const clearResettingFlagIfNeeded = async (
  data: ResetGuidesJob | ResetGuidesForGuideBasesJob
) => {
  const { resetLevel, resetObjectId } = data;
  const guideBaseIds = (
    (data as ResetGuidesForGuideBasesJob).guideBases || []
  ).map(({ guideBaseId }) => guideBaseId);

  if (resetObjectId !== undefined) {
    switch (resetLevel) {
      case ResetLevel.Template:
        await Template.update(
          { isResetting: false },
          { where: { id: resetObjectId } }
        );

        break;
      case ResetLevel.Account:
        await Account.update(
          { isResetting: false },
          { where: { id: resetObjectId } }
        );

        break;
      case ResetLevel.GuideBase:
        await GuideBase.update(
          { isResetting: false },
          { where: { id: resetObjectId } }
        );

        break;
    }
  }

  if (guideBaseIds.length > 0) {
    await GuideBase.update(
      { isResetting: false },
      { where: { id: guideBaseIds } }
    );
  }
};

export const setResettingFlagForGuideBases = async (guideBaseIds: number[]) => {
  await GuideBase.update(
    { isResetting: true },
    { where: { id: guideBaseIds } }
  );
};
