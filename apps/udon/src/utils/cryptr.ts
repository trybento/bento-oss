import Cryptr from 'cryptr';

/** IMPORTANT: Set this string ahead of running. */
const PW_STRING =
  process.env.CRYPTR_KEY || process.env.JWT_SECRET || 'letsNotUseThisLol';

const cryptr = new Cryptr(PW_STRING);

const Encryption = {
  encrypt: (input: string) => cryptr.encrypt(input),
  decrypt: (input: string) => cryptr.decrypt(input),
};

export default Encryption;
