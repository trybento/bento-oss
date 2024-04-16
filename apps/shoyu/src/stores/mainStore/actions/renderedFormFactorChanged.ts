import { formFactorSelector } from './../helpers/selectors';
import { GlobalStateActionPayload } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';

export default function renderedFormFactorChanged(
  state: WorkingState,
  payload: GlobalStateActionPayload<'renderedFormFactorChanged'>
) {
  const formFactorState = formFactorSelector(state, payload.formFactor);
  if (formFactorState) {
    formFactorState.renderedFormFactor = payload.renderedFormFactor;
  }
}
