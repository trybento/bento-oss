import { Guide } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';
import { EmbedFormFactorsForGuideFormFactor } from 'bento-common/data/helpers';
import { EmbedFormFactor } from 'bento-common/types';
import sidebarStore from '../../sidebarStore';

type Payload = {
  id: string;
  guides?: Guide[];
  /**
   * If the guide uses the legacy form factor format you may want to
   * provide the optional `formFactor` override. This is necessary
   * to handle the sidebar previews.
   */
  formFactor?: EmbedFormFactor;
  isPreview: boolean;
  sidebarStateId?: string;
};

/**
 * Assumes all guides related to this preview id will share the same
 * form factor, since the expectation is that different form factors
 * would ultimately use different ids.
 */
export default function formFactorCreated(
  state: WorkingState,
  { id, guides = [], formFactor, isPreview, sidebarStateId }: Payload
) {
  const ff =
    EmbedFormFactorsForGuideFormFactor[formFactor || guides[0].formFactor]?.[0];

  if (ff) {
    const oldRenderedFormFactor = state.formFactors[id]?.renderedFormFactor;
    const oldEmbedFormFactor = state.formFactors[id]?.formFactor;
    state.formFactors[id] = {
      id,
      formFactor: ff,
      renderedFormFactor:
        (oldEmbedFormFactor === ff && oldRenderedFormFactor) || ff,
      guides: guides.map((guide) => guide?.entityId),
      selectedGuide: undefined,
      selectedModule: undefined,
      selectedStep: undefined,
      selectedAt: new Date(),
      isPreview,
      sidebarStateId,
    };

    if (sidebarStateId) {
      const state = sidebarStore.getState();
      if (!state.sidebars[sidebarStateId]) {
        state.createSidebarState(sidebarStateId, isPreview);
      }
    }
  }
}
