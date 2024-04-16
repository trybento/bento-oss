import { GuideExpirationCriteria } from 'bento-common/types';

import { Guide } from 'src/data/models/Guide.model';
import NoContentError from 'src/errors/NoContentError';
import { addToGuideExpirationDate } from 'src/utils/guideExpiration';
import { logger } from 'src/utils/logger';

type Args = {
  /** The guide to update the expiration date for */
  guide: Guide;
  /**
   * Determines the date when the last activity happened (e.g. completing a step)
   * @default "now" when not set
   */
  lastActivityAt?: Date;
};

export async function updateGuideExpireAt({ guide, lastActivityAt }: Args) {
  const template = await guide.$get('createdFromTemplate', {
    attributes: ['expireBasedOn', 'expireAfter'],
  });

  if (!template) {
    throw new NoContentError(guide.createdFromTemplateId || 0, 'template');
  }

  let expireAt: Date | undefined;

  switch (template.expireBasedOn) {
    case GuideExpirationCriteria.never:
    case GuideExpirationCriteria.launch:
      // we shouldn't do anything if not set to expire OR set to expire on launch,
      // since the first shouldn't have any effect and the later should have been handled when the guide
      // got created/launched
      expireAt = undefined;
      break;

    case GuideExpirationCriteria.stepCompletion: {
      if (!lastActivityAt) {
        throw new Error(
          'Failed to update guide completion due to missing last activity date'
        );
      }

      if (!template.expireAfter) {
        throw new Error(
          `Expected template to have 'expireAfter' set, but received: ${template.expireAfter}`
        );
      }

      expireAt = addToGuideExpirationDate(
        lastActivityAt || new Date(),
        template.expireAfter!
      );
      break;
    }

    default:
      logger.error(
        `Missing implementation to update guide expiration date based on: ${template.expireBasedOn}`
      );
  }

  // skip if no new expiration date was set
  if (!expireAt) return;

  return await guide.update({ expireAt });
}
