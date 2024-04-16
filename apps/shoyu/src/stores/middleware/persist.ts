import { debugMessage } from 'bento-common/utils/debugging';
import { GetState, SetState, State, StoreApi } from 'zustand/vanilla';

import catchException from '../../lib/catchException';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type StateStorage = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
};

type StorageValueVersion = number | string;

export type StorageValue<S> = {
  /** Persisted state */
  state: DeepPartial<S>;
  /** Signature that represents the owner of the state (i.e. appId, account, user) */
  signature?: string;
  /** App version when the state was created */
  version: StorageValueVersion;
  /** Expiration date built from ttl option */
  expireAt?: Date;
};

export type PersistOptions<
  S,
  PersistedState extends Partial<S> = Partial<S>
> = {
  /** Name of the storage (must be unique) */
  name: string;
  /** Persisted state TTL, in seconds
   *
   * @default 7200 seconds (2 hours)
   */
  ttl?: number;
  /**
   * A function returning a storage.
   * The storage must fit `window.sessionStorage`'s api.
   *
   * @default () => sessionStorage
   */
  getStorage?: () => StateStorage;
  /**
   * A function returning a string signature of the store's state.
   * The returned string will be stored in the storage and matched
   * against later to determine whether or not we can hydrate from it.
   *
   * @default () => undefined
   */
  getSignature?: () => string;
  /**
   * Use a custom serializer.
   * The returned string will be stored in the storage.
   *
   * @default JSON.stringify
   */
  serialize?: (state: StorageValue<S>) => string;
  /**
   * Use a custom deserializer.
   * Must return an object matching StorageValue<State>
   *
   * @param str The storage's current value.
   * @default JSON.parse
   */
  deserialize?: (str: string) => StorageValue<PersistedState>;
  /**
   * @todo describe and fix return type
   *
   * @param str The storage's current value.
   * @default JSON.parse
   */
  partialize?: (state: S) => DeepPartial<S>;
  /**
   * If the stored state's version mismatch the one specified here,
   * we will not hydrate from it.
   *
   * @default 0
   */
  version?: StorageValueVersion;
  /**
   * A function to perform custom hydration merges when combining the stored state with the current one.
   * By default, this function does a shallow merge.
   */
  merge?: (persistedState: any, currentState: S) => S;
};

export interface StorePersist<_S extends State> {
  persist: {
    /** Clear all persisted state */
    clearStorage: () => void;
    /** Hydrate persisted state */
    hydrate: () => void;
    /** Whether or not successfully hydrated from persisted state */
    hasHydrated: () => boolean;
    /** Unlock writting to persistence */
    unlock: () => void;
  };
}

export const persist =
  <
    S extends State,
    CustomSetState extends SetState<S> = SetState<S>,
    CustomGetState extends GetState<S> = GetState<S>,
    CustomStoreApi extends StoreApi<S> = StoreApi<S>
  >(
    config: (
      set: CustomSetState,
      get: CustomGetState,
      api: CustomStoreApi
    ) => S,
    baseOptions: PersistOptions<S>
  ) =>
  (
    set: CustomSetState,
    get: CustomGetState,
    api: CustomStoreApi & StoreApi<S> & StorePersist<S>
  ): S => {
    const options = {
      ttl: 2 * 60 * 60, // 2 hours
      getStorage: () => sessionStorage,
      getSignature: () => undefined,
      serialize: JSON.stringify as (state: StorageValue<S>) => string,
      deserialize: JSON.parse as (str: string) => StorageValue<Partial<S>>,
      partialize: (state: S) => state,
      version: 0,
      merge: (persistedState: any, currentState: S) => ({
        ...currentState,
        ...persistedState,
      }),
      ...baseOptions,
    };

    let isLocked = true;
    let hasHydrated = false;
    let storage: StateStorage | undefined;
    let expireAt: Date = new Date(Date.now() + options.ttl * 1000);
    /** Keeps a record of the last serialized value for error handling purposes */
    let lastSerializedValue: string | undefined;

    try {
      storage = options.getStorage();
    } catch (e) {
      // prevent error if the storage is not defined/available
    }

    if (!storage) {
      return config(
        ((...args) => {
          debugMessage(
            `[BENTO] Unable to persist '${options.name}', the given storage is currently unavailable`
          );
          set(...args);
        }) as CustomSetState,
        get,
        api
      );
    }

    const ownCatchException = (e: unknown | Error) => {
      catchException(e as Error, `'${options.name}' persist middleware`);
    };

    const setItem = (): void => {
      try {
        if (isLocked) return;
        const state = options.partialize({ ...get() });
        lastSerializedValue = options.serialize({
          state,
          signature: options.getSignature(),
          version: options.version,
          expireAt,
        });
        (storage as StateStorage).setItem(options.name, lastSerializedValue);
      } catch (e) {
        ownCatchException(e);
      } finally {
        lastSerializedValue = undefined;
      }
    };

    const savedSetState = api.setState;

    api.setState = (state, replace) => {
      savedSetState(state, replace);
      void setItem();
    };

    const configResult = config(
      ((...args) => {
        set(...args);
        void setItem();
      }) as CustomSetState,
      get,
      api
    );

    // a workaround to solve the issue of not storing rehydrated state in sync storage
    // the set(state) value would be later overridden with initial state by create()
    // to avoid this, we merge the state from storage into the initial state.
    let stateFromStorage: S | undefined;

    // rehydrate initial state with existing stored state
    const hydrate = () => {
      if (!storage) return;

      hasHydrated = false;
      isLocked = false;

      try {
        const storageValue = storage.getItem(options.name);
        if (storageValue) {
          const deserializedStorageValue = options.deserialize(storageValue);
          if (
            // if version exist
            ['number', 'string'].includes(
              typeof deserializedStorageValue.version
            ) &&
            // versions match
            deserializedStorageValue.version === options.version &&
            // signature matches
            deserializedStorageValue.signature === options.getSignature() &&
            // data is still valid
            (!deserializedStorageValue.expireAt ||
              new Date().getTime() <
                new Date(deserializedStorageValue.expireAt).getTime())
          ) {
            if (deserializedStorageValue.expireAt) {
              expireAt = deserializedStorageValue.expireAt;
            }

            const stateFromStorage = options.merge(
              deserializedStorageValue.state as S,
              get() ?? configResult
            );

            set(stateFromStorage as S, true);
            void setItem();
            debugMessage(`[BENTO] '${options.name}' hydrated from storage`);
            hasHydrated = true;
          }
        }
      } catch (e) {
        ownCatchException(e);
      }
    };

    api.persist = {
      clearStorage: () => {
        try {
          void storage?.removeItem?.(options.name);
        } catch (innerError) {
          // fail-safe
          debugMessage(`[BENTO] '${options.name}' failed to clear storage`);
        }
      },
      hydrate: () => hydrate(),
      hasHydrated: () => hasHydrated,
      unlock: () => void (isLocked = false),
    };

    return stateFromStorage || configResult;
  };
