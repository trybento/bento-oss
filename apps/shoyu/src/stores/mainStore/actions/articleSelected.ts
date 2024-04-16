import { GlobalStateActionPayloads } from 'bento-common/types/globalShoyuState';

import { formFactorSelector } from '../helpers/selectors';
import { WorkingState } from '../types';

/**
 * Store a selected kb article so it can be expanded in the kbArticle view
 */
export default function articleSelected(
  state: WorkingState,
  { formFactor, article }: GlobalStateActionPayloads['articleSelected']
) {
  const formFactorState = formFactorSelector(state, formFactor);

  if (formFactorState) {
    formFactorState.article = article;
  }
}
