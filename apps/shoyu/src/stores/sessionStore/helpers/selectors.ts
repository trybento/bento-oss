import {
  Account,
  AccountUser,
  Organization,
} from 'bento-common/types/globalShoyuState';

import { WorkingSessionState } from '../types';

export const tokenSelector = (state: WorkingSessionState): string | undefined =>
  state.token;

export const accountSelector = (
  state: WorkingSessionState
): Account | undefined => state.account;

export const accountUserSelector = (
  state: WorkingSessionState
): AccountUser | undefined => state.accountUser;

export const orgSelector = (
  state: WorkingSessionState
): Organization | undefined => state.organization;

/**
 * NOTE: To prevent unexpected errors, this currently only returns the
 * enabled feature flags if the organization is already loaded, effectively
 * mimicing the previous behavior (where ffs came with the org).
 */
export const ffSelector = (state: WorkingSessionState) => {
  state.organization ? state.enabledFeatureFlags || [] : [];
};
