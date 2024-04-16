import nodeCrypto from 'crypto';

// @ts-ignore
window.crypto = {
  // @ts-ignore-error
  getRandomValues: function (buffer) {
    // @ts-ignore-error
    return nodeCrypto.randomFillSync(buffer);
  },
};
