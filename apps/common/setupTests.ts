import nodeCrypto from 'crypto';

// @ts-ignore
window.crypto = {
  // @ts-ignore
  getRandomValues: function (buffer) {
    // @ts-ignore
    return nodeCrypto.randomFillSync(buffer);
  },
};
