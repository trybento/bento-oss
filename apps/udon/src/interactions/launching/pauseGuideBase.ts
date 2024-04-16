import { GuideBaseState } from 'bento-common/types';

import type { GuideBase } from 'src/data/models/GuideBase.model';
import { updateManualLaunchFlagForTemplates } from '../library/library.helpers';
import { invalidateLaunchingCacheForOrgAsync } from '../caching/identifyChecksCache';

/**
 * Set a flag on the guide base to indicate that launching to new users is paused.
 */
export async function pauseGuideBase(guideBase: GuideBase): Promise<GuideBase> {
  const organization = await guideBase.$get('organization');

  const updatedGuideBase = await guideBase.update({
    state: GuideBaseState.paused,
  });

  if (guideBase.wasAutoLaunched === false && guideBase.createdFromTemplateId) {
    await updateManualLaunchFlagForTemplates({
      templateIds: [guideBase.createdFromTemplateId],
    });
  }

  void invalidateLaunchingCacheForOrgAsync(organization!, 'pauseGuideBase');

  return updatedGuideBase;
}
