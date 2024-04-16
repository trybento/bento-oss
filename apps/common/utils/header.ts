import { $enum } from 'ts-enum-util';

import { capitalizeFirstLetter } from './strings';
import { GuideHeaderType, GuideHeaderTypeFlags } from '../types';

export function getHeaderStyleFlags(
  type: GuideHeaderType
): GuideHeaderTypeFlags {
  return Object.fromEntries(
    $enum(GuideHeaderType)
      .getEntries()
      .map(([key, value]) => [
        `is${capitalizeFirstLetter(key)}Header`,
        type === value,
      ])
  ) as GuideHeaderTypeFlags;
}
