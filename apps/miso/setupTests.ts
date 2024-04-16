import nodeCrypto from 'crypto';

/**
 * Needed in order for the 'uuid' library
 * to work in the test environment.
 */
window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
} as any;
