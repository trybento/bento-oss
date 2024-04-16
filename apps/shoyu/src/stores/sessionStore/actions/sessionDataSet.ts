import { WorkingSessionState } from '../types';

export type SessionDataSetPayload = {
  token: string | undefined;
  enabledFeatureFlags: string[] | null | undefined;
};

export default function sessionDataSet(
  state: WorkingSessionState,
  payload: SessionDataSetPayload
) {
  state.token = payload.token;
  state.enabledFeatureFlags = payload.enabledFeatureFlags || [];
}
