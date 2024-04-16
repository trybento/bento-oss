import { formFactorSelector } from './../mainStore/helpers/selectors';
import { FormFactorStateKey } from 'bento-common/types/globalShoyuState';

import { isPreviewFormFactor } from '../mainStore/helpers';
import { MainStoreState } from '../mainStore/types';
import { MAIN_SIDEBAR_STATE_ID } from './constants';

export function formFactorToSidebarStateId(
  state: MainStoreState,
  formFactor: FormFactorStateKey
) {
  const formFactorState = formFactorSelector(state, formFactor);
  return isPreviewFormFactor(state, formFactor)
    ? formFactor
    : formFactorState?.sidebarStateId || MAIN_SIDEBAR_STATE_ID;
}
