import {
  GlobalState,
  GuideHydrationState,
} from 'bento-common/types/globalShoyuState';
import { isPlainObject } from 'bento-common/utils/lodash';

import { StorageValue } from '../../middleware/persist';

export const getVerifierKeyValue = (): string => {
  return `${window.bentoSettings?.appId}:${window.bentoSettings?.account?.id}:${window.bentoSettings?.accountUser?.id}`;
};

export const getPersistenceVersion = (
  commitSha: string | undefined = process.env.VITE_COMMIT_SHA
): number | string => {
  // when running in local/test envs
  if (commitSha === 'dev' || !commitSha) {
    return 0;
  }
  return commitSha;
};

export const reviveDates = (key: string, value: any) => {
  const dateKeys = [
    'initialized',
    'completedAt',
    'doneAt',
    'savedAt',
    'expireAt', // modal throttling persistence
    'dismissedAt', // tagged elements
    'firstSeenAt', // nps-related
    'answeredAt', // nps-related
    'selectedAt', // form factors guide selection
    'startedAt', // journeys metadata
  ];

  if (dateKeys.includes(key) && value) {
    const date = new Date(value);
    // @ts-expect-error
    if (isNaN(date)) {
      throw new Error(`Failed to revive date: '${value}'`);
    }
    return date;
  }
  return value;
};

/**
 * Remove individual keys from the state so those wont be persisted.
 */
export const removeFromPersistence = (key: string, value: any) => {
  // we should never persist the hydration state of a guide,
  // otherwise we run the risk of skipping their hydration the next time
  // Bento is initialized and showing stale data to the end-user
  if (
    key === 'hydrationState' &&
    Object.values(GuideHydrationState).includes(value)
  ) {
    return undefined;
  }
  return value;
};

/**
 * Remove preview items (isPreview/previewId) from the root level items of the state
 * to make sure those wont be persisted.
 *
 * WARNING: Shouldn't be used for non-root level values since it wasn't built for that.
 */
export const removePreviewItems = (value: GlobalState[keyof GlobalState]) => {
  if (value && isPlainObject(value)) {
    return Object.keys(value).reduce<GlobalState[keyof GlobalState]>(
      (acc, valueKey) => {
        if (
          value[valueKey] &&
          isPlainObject(value[valueKey]) &&
          (value[valueKey]?.isPreview || value[valueKey]?.previewId)
        ) {
          return acc;
        }

        if (acc) {
          acc[valueKey] = value[valueKey];
        }
        return acc;
      },
      {}
    );
  }

  return value;
};

/**
 * Sanitize state value for persistence and remove unwanted keys and preview items from root-level values.
 */
export const sanitizeStateForPersistence = ({
  state,
  ...rest
}: StorageValue<GlobalState>) => {
  return JSON.stringify(
    {
      ...rest,
      state: Object.keys(state).reduce((acc, rootStateKey) => {
        acc[rootStateKey] = [
          'guides',
          'modules',
          'steps',
          'formFactors',
          'taggedElements',
          'stepAutoCompleteInteractions',
          'inlineEmbeds',
        ].includes(rootStateKey)
          ? removePreviewItems(state[rootStateKey])
          : state[rootStateKey];

        return acc;
      }, {}),
    },
    removeFromPersistence
  );
};
