import { VIEWED_FROM } from 'bento-common/data/helpers';
import { EmbedFormFactor } from 'bento-common/types';

import { trackGuideViewingEnded } from 'src/interactions/analytics/trackGuideViewingEnded';
import detachPromise from 'src/utils/detachPromise';

interface AccountUserViewingTrack {
  organizationEntityId: string;
  data: {
    [formFactor: string]: {
      guideEntityId?: string | null;
      stepEntityId?: string | null;
    };
  };
}

/** Map by accountUser entityId */
export const accountUserClientMap = new Map<string, AccountUserViewingTrack>();

export const getAccountUserTrack = (accountUserEntityId: string) => {
  return accountUserClientMap.get(accountUserEntityId);
};

export const setAccountUserTrack = (
  accountUserEntityId: string,
  organizationEntityId: string
) => {
  const track = getAccountUserTrack(accountUserEntityId);
  if (!track)
    accountUserClientMap.set(accountUserEntityId, {
      organizationEntityId,
      data: Object.keys(EmbedFormFactor).reduce((a, formFactor) => {
        a[formFactor] = {};
        return a;
      }, {}),
    });
};

export const deleteAccountUserTrack = (accountUserEntityId: string) => {
  accountUserClientMap.delete(accountUserEntityId);
};

export const setViewingGuide = (
  accountUserEntityId: string,
  formFactor: string,
  guideEntityId: string | null | undefined
) => {
  const track = getAccountUserTrack(accountUserEntityId);
  if (track && formFactor && track.data[formFactor]) {
    track.data[formFactor].guideEntityId = guideEntityId;
  }
};

export const setViewingStep = (
  accountUserEntityId: string,
  formFactor: string,
  stepEntityId: string | null | undefined
) => {
  const track = getAccountUserTrack(accountUserEntityId);
  if (track && formFactor && track.data[formFactor]) {
    track.data[formFactor].stepEntityId = stepEntityId;
  }
};

export const endPreviousGuideViewingGql = (
  accountUserEntityId: string,
  formFactor: string
) => {
  if (!accountUserEntityId || !formFactor) return;
  const currentTrack = getAccountUserTrack(accountUserEntityId);
  if (!currentTrack?.data?.[formFactor]?.guideEntityId) return;

  detachPromise(
    () =>
      trackGuideViewingEnded({
        guideEntityId: currentTrack.data[formFactor].guideEntityId!,
        viewedFrom: VIEWED_FROM[formFactor],
        accountUserEntityId,
        organizationEntityId: currentTrack.organizationEntityId,
      }),
    'trackGuideViewingEnded'
  );
  currentTrack.data[formFactor].guideEntityId = null;
};
