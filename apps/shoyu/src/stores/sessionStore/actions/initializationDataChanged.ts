import { InitializationDataPayload, WorkingSessionState } from '../types';

export default function initializationDataChanged(
  state: WorkingSessionState,
  { account, accountUser, organization, uiSettings }: InitializationDataPayload
) {
  state.account = account || state.account;
  state.accountUser = accountUser || state.accountUser;
  state.organization = organization || state.organization;
  state.uiSettings = uiSettings;
}
