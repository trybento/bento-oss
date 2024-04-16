import { GuideBaseState } from 'bento-common/types';

import type { GuideBase } from 'src/data/models/GuideBase.model';
import { updateManualLaunchFlagForTemplates } from './library/library.helpers';
import { invalidateLaunchingCacheForOrgAsync } from './caching/identifyChecksCache';

/**
 * Clear the flag on the guide base that indicates that launching to new users is paused.
 */
export async function unpauseGuideBase(
  guideBase: GuideBase
): Promise<GuideBase> {
  const organization = await guideBase.$get('organization');

  const updatedGuideBase = await guideBase.update({
    state: GuideBaseState.active,
  });

  if (guideBase.wasAutoLaunched === false && guideBase.createdFromTemplateId) {
    await updateManualLaunchFlagForTemplates({
      templateIds: [guideBase.createdFromTemplateId],
    });
  }

  invalidateLaunchingCacheForOrgAsync(organization!, 'unpauseGuideBase');

  return updatedGuideBase;
}
