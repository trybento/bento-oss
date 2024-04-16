import {
  ClientStorage,
  removeFromClientStorage,
} from 'bento-common/utils/clientStorage';

// Prevent persisted values from other accountUsers to create unexpected results.
export default function resetPersistedValues() {
  if (typeof window === 'undefined' || !window) {
    return;
  }

  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith('bento-')) {
      removeFromClientStorage(ClientStorage.localStorage, key);
    }
  }

  for (const key of Object.keys(window.sessionStorage)) {
    if (key.startsWith('bento-')) {
      removeFromClientStorage(ClientStorage.sessionStorage, key);
    }
  }
}
