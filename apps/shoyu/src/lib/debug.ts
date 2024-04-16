import { createDebugLogger } from 'bento-common/utils/debugging';
import {
  ClientStorage,
  readFromClientStorage,
} from 'bento-common/utils/clientStorage';
import { debounce } from 'bento-common/utils/lodash';

import { IS_PROD, IS_TEST } from './constants';

export const isDebugEnabled = debounce(
  (): boolean =>
    (window as any).debugBento === true ||
    !!readFromClientStorage(ClientStorage.localStorage, 'debugBento'),
  100,
  { leading: true }
) as () => boolean;

export const isDevtoolsEnabled = () => {
  return !IS_TEST && (!IS_PROD || isDebugEnabled());
};

createDebugLogger(isDebugEnabled);
