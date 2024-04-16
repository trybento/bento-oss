import { add, sub } from 'date-fns';
import create, { GetState, Mutate, SetState, StoreApi } from 'zustand/vanilla';
import { persist, StorePersist } from './persist';

const createPersistentStore = (initialValue: string | null) => {
  let state = initialValue;

  const getItem = (): string | null => {
    getItemSpy();
    return state;
  };
  const setItem = (name: string, newState: string) => {
    setItemSpy(name, newState);
    state = newState;
  };
  const removeItem = (name: string) => {
    removeItemSpy(name);
    state = null;
  };

  const getItemSpy = jest.fn();
  const setItemSpy = jest.fn();
  const removeItemSpy = jest.fn();

  return {
    storage: { getItem, setItem, removeItem },
    getItemSpy,
    setItemSpy,
  };
};

describe('persist middleware', () => {
  const nowMock = new Date();
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(nowMock);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('can rehydrate state', () => {
    const storage = {
      getItem: (name: string) =>
        JSON.stringify({
          state: { count: 42, name },
          version: 0,
          expireAt: add(new Date(), { days: 2 }),
        }),
      setItem: () => {},
      removeItem: () => {},
    };

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(
        () => ({
          count: 0,
          name: 'empty',
        }),
        {
          name: 'test-storage',
          getStorage: () => storage,
        }
      )
    );
    store.persist.hydrate();
    expect(store.persist.hasHydrated).toBeTruthy();
    expect(store.getState()).toEqual({
      count: 42,
      name: 'test-storage',
    });
  });

  test('wont hydrate from different versions', () => {
    const storage = {
      getItem: (name: string) =>
        JSON.stringify({
          state: { count: 42, name },
          version: 'new version',
          expireAt: add(new Date(), { days: 2 }),
        }),
      setItem: () => {},
      removeItem: () => {},
    };

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(
        () => ({
          count: 0,
          name: 'empty',
        }),
        {
          name: 'test-storage',
          version: 'old version',
          getStorage: () => storage,
        }
      )
    );
    store.persist.hydrate();
    expect(store.persist.hasHydrated()).toBeFalsy();
    expect(store.getState()).toEqual({
      count: 0,
      name: 'empty',
    });
  });

  test('wont hydrate from different signatures', () => {
    const storage = {
      getItem: (name: string) =>
        JSON.stringify({
          state: { count: 42, name },
          version: 'same version',
          signature: 'app1:a2:u3',
          expireAt: add(new Date(), { days: 2 }),
        }),
      setItem: () => {},
      removeItem: () => {},
    };

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(
        () => ({
          count: 0,
          name: 'empty',
        }),
        {
          name: 'test-storage',
          version: 'same version',
          getSignature: () => 'app3:a2:u1',
          getStorage: () => storage,
        }
      )
    );
    store.persist.hydrate();
    expect(store.persist.hasHydrated()).toBeFalsy();
    expect(store.getState()).toEqual({
      count: 0,
      name: 'empty',
    });
  });

  test('wont hydrate if expired', () => {
    const storage = {
      getItem: (name: string) =>
        JSON.stringify({
          state: { count: 42, name },
          version: 'same version',
          signature: 'same signature',
          expireAt: sub(new Date(), { seconds: 10 }), // expired 10s ago
        }),
      setItem: () => {},
      removeItem: () => {},
    };

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(
        () => ({
          count: 0,
          name: 'empty',
        }),
        {
          name: 'test-storage',
          version: 'same version',
          getSignature: () => 'same signature',
          getStorage: () => storage,
        }
      )
    );
    store.persist.hydrate();
    expect(store.persist.hasHydrated()).toBeFalsy();
    expect(store.getState()).toEqual({
      count: 0,
      name: 'empty',
    });
  });

  test('can persist state', () => {
    const { storage, setItemSpy } = createPersistentStore(null);

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(() => ({ count: 0 }), {
        name: 'test-storage',
        version: 0,
        getStorage: () => storage,
      })
    );

    // Initialize from empty storage
    expect(store.getState()).toEqual({ count: 0 });

    // unlock writting to the persistence
    store.persist.unlock();

    // Write something to the store
    store.setState({ count: 42 });
    expect(store.getState()).toEqual({ count: 42 });
    expect(setItemSpy).toBeCalledWith(
      'test-storage',
      JSON.stringify({
        state: {
          count: 42,
        },
        version: 0,
        expireAt: add(nowMock, { hours: 2 }),
      })
    );
  });

  test('locking mechanism works', () => {
    const { storage, setItemSpy } = createPersistentStore(null);

    const store = create<
      any,
      SetState<any>,
      GetState<any>,
      Mutate<StoreApi<any>, []> & StorePersist<any>
    >(
      persist(() => ({ count: 0 }), {
        name: 'test-storage',
        version: 0,
        getStorage: () => storage,
      })
    );

    store.setState({ count: 3 });
    expect(setItemSpy).not.toHaveBeenCalled();
    store.persist.unlock();
    store.setState({ count: 9 });
    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });
});
