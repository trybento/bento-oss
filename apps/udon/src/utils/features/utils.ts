import { groupBy } from 'lodash';
import { allFlags } from './api';

export function addAliasedFlags(flagNames: string[]) {
  let enabledFlagNames = flagNames.slice();
  const flagsByAliasName = groupBy(
    allFlags.filter((ff) => ff.alias),
    'alias.name'
  );
  for (const flagName of flagNames) {
    const aliases = flagsByAliasName[flagName];
    if (aliases) {
      enabledFlagNames = enabledFlagNames.concat(aliases.map((ff) => ff.name));
    }
  }
  return enabledFlagNames;
}
