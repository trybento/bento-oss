export enum ClientStorage {
  localStorage,
  sessionStorage,
  object,
}
class ObjectStorage {
  data: { [key: string]: string } = {};
  getItem(key: string): any {
    return this.data[key];
  }
  setItem(key: string, value: string) {
    this.data[key] = value;
  }
  removeItem(key: string) {
    delete this.data[key];
  }
}
const objectStore = new ObjectStorage();

export const getStorage = (type: ClientStorage): Storage | ObjectStorage => {
  return type === ClientStorage.localStorage
    ? window?.localStorage
    : ClientStorage.sessionStorage
    ? window?.sessionStorage
    : objectStore;
};

export const saveToClientStorage = <V>(
  storage: ClientStorage,
  key: string,
  value: V
) => {
  try {
    getStorage(storage).setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  } catch (err) {
    // Fail silently for server's context, otherwise warn
    if (typeof window !== 'undefined') {
      console.error('[BENTO] Error writing to client storage', err);
    }
  }
};

export const readFromClientStorage = <V>(
  storage: ClientStorage,
  key: string,
  reviver?: Parameters<typeof JSON.parse>[1]
): V | undefined => {
  try {
    const recoveredState = getStorage(storage).getItem(key);
    return recoveredState
      ? recoveredState[0] === '{'
        ? JSON.parse(recoveredState, reviver)
        : recoveredState === 'true'
        ? true
        : recoveredState === 'false'
        ? false
        : recoveredState
      : undefined;
  } catch (err) {
    // Fail silently for server's context, otherwise warn
    if (typeof window !== 'undefined') {
      console.warn('[BENTO] Error reading from client storage', err);
    }
  }
  return undefined;
};

export const removeFromClientStorage = (
  storage: ClientStorage,
  key: string
) => {
  getStorage(storage).removeItem(key);
};
