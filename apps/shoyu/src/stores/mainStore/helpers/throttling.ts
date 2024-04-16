import {
  GuideEntityId,
  ModalSeenEntry,
  ModalsSeenEntries,
} from 'bento-common/types/globalShoyuState';
import {
  ClientStorage,
  readFromClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';

import catchException from '../../../lib/catchException';
import sessionStore from '../../sessionStore';
import { reviveDates } from './persistence';

const MODAL_SEEN_STORAGE_CLASS = ClientStorage.sessionStorage;
export const MODAL_SEEN_STORAGE_KEY = 'bento-modalSeen';
export const MODAL_SEEN_TTL = 24 * 60 * 60 * 1000; // 24h in seconds

/** Makes the throttle unique per user */
export const getModalSessionKey = () => {
  const accountUserId = sessionStore.getState().accountUser?.entityId;
  return `${MODAL_SEEN_STORAGE_KEY}-${accountUserId}`;
};

/**
 * Checks if another modal has been seen within this user session,
 * and take into account whether or not that throttling key has
 * already expired.
 */
export function hasSeenAnotherModal(guide: GuideEntityId): boolean {
  try {
    const modalSeenEntries = readFromClientStorage<ModalsSeenEntries>(
      MODAL_SEEN_STORAGE_CLASS,
      getModalSessionKey(),
      reviveDates
    );

    if (modalSeenEntries) {
      return Object.values<ModalSeenEntry>(modalSeenEntries).some(
        ({ guide: throttledGuide, expireAt }) => {
          return (
            throttledGuide !== guide && (expireAt?.getTime() || 0) > Date.now()
          );
        }
      );
    }
    return false;
  } catch (err) {
    catchException(err as Error, 'checking if another modal has been seen');
    return false;
  }
}

/**
 * Reads from the storage and clears all invalid/expired items,
 * returning all entries that remain valid for throttling.
 */
export function filterExpiredModalSeen(storageKey: string): ModalsSeenEntries {
  const existingEntries =
    readFromClientStorage<ModalsSeenEntries>(
      MODAL_SEEN_STORAGE_CLASS,
      storageKey,
      reviveDates
    ) || {};

  return Object.values<ModalSeenEntry>(
    existingEntries
  ).reduce<ModalsSeenEntries>((acc, entry) => {
    const { guide, expireAt } = entry;
    if (guide && expireAt && expireAt.getTime() > new Date().getTime()) {
      return Object.assign(acc, { [entry.guide]: entry });
    }
    return acc;
  }, {});
}

/**
 * Record a modal as seen within the persistence to potentially
 * throttle other modals within the same session.
 */
export function recordModalSeen(guide: GuideEntityId) {
  const modalSeenKey = getModalSessionKey();
  const newEntries: ModalsSeenEntries = {
    ...filterExpiredModalSeen(modalSeenKey),
    [guide]: {
      guide,
      expireAt: new Date(Date.now() + MODAL_SEEN_TTL),
    },
  };
  saveToClientStorage<ModalsSeenEntries>(
    MODAL_SEEN_STORAGE_CLASS,
    modalSeenKey,
    newEntries
  );

  // Schedule a timer to automatically clear expired entries from the storage
  setTimeout(() => void filterExpiredModalSeen(modalSeenKey), MODAL_SEEN_TTL);
}
