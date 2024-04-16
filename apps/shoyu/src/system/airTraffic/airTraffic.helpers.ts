import { AtLeast } from 'bento-common/types';
import { Guide } from 'bento-common/types/globalShoyuState';
import { isEverboarding } from 'bento-common/data/helpers';

import { AirTrafficContext } from '../../stores/airTrafficStore/types';

/**
 * Determine if the sidebar needs to auto open based on various factors
 *
 * This currently specifically controls the full auto-open animation, which is
 *   designed to let end users be aware of the sidebar on their first exposure
 * to Bento. Especially when there is no inline, so Bento isn't discoverable.
 *
 * Note this does not currently cover the focusing behaviors covered in
 *   GuideAndStepTransitions
 */
export const shouldSidebarAutoOpen = ({
  guide,
  context,
}: {
  guide?: Guide;
  context: AtLeast<
    AirTrafficContext,
    'isMobile' | 'inlineEmbedPresent' | 'toggledOffAtLeastOnce'
  > & {
    settings: AtLeast<AirTrafficContext['settings'], 'preventAutoOpens'>;
  };
}) => {
  if (!guide) return false;

  /**
   * Prevent auto expansion behaviors based on toggle settings. We should still
   *   allow manual behaviors so things don't appear unresponsive.
   */
  if (context.settings.preventAutoOpens) return false;

  if (context.toggledOffAtLeastOnce) return false;

  if (isEverboarding(guide.designType)) return false;

  if (context.isMobile) return false;

  if (guide.isViewed) return false;

  if (context.inlineEmbedPresent) return false;

  return true;
};
