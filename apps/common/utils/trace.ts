export const REQUEST_ID_HEADER = 'x-request-id';

export const BENTO_INIT_ID_HEADER = 'x-bento-init-id';

export const BENTO_INIT_ID_SENTRY_TAG = 'bentoInitId';

export const genTraceId = () => Math.random().toString(36).substr(2, 9);
