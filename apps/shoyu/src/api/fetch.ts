import { fetch as fetchPolyfill } from 'whatwg-fetch';

import { withCatchException } from '../lib/catchException';

export default withCatchException(fetchPolyfill, 'fetch');
