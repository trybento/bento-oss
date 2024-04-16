import { zxcvbn, ZxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';

async function setupZxcvbnOptions() {
  const common = await import('@zxcvbn-ts/language-common');
  const english = await import('@zxcvbn-ts/language-en');

  ZxcvbnOptions.setOptions({
    dictionary: {
      ...common.default.dictionary,
      ...english.default.dictionary,
    },
    graphs: common.default.adjacencyGraphs,
    translations: english.default.translations,
  });
}

export async function getPasswordStrength(
  password: string,
  prohibitedPasswords?: string[]
): Promise<ZxcvbnResult> {
  await setupZxcvbnOptions();
  return zxcvbn(password, prohibitedPasswords) as ZxcvbnResult;
}
