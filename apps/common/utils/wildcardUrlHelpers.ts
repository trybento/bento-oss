import { DYNAMIC_ATTRIBUTE_REGEX } from '../data/helpers';

type WildcardReplacements = {
  path: string;
  pathAll: string;
  query: string;
  hash: string;
  hashPath: string;
  hashQuery: string;
};

type ReplacementOptions = {
  consumeRemainingIfAtEnd?: boolean;
  escape?: boolean;
  inputIsEscaped?: boolean;
};

const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const displayUrlWildcardRegex = /\*/g;
const wildcardDisplayUrlRegex = /\[\^\/\]\+|\[\^&\]\+|\.\+|\?\.\*/g;

const wildcardReplacements: WildcardReplacements = {
  path: '[^/]+',
  pathAll: '?.*',
  query: '[^&]+',
  hash: '.+',
  hashPath: '[^/]+',
  hashQuery: '[^&]+',
};
const displayUrlReplacements: WildcardReplacements = {
  path: '*',
  pathAll: '*',
  query: '*',
  hash: '*',
  hashPath: '*',
  hashQuery: '*',
};

const defaultReplacementOptions: ReplacementOptions = {
  consumeRemainingIfAtEnd: false,
  escape: true,
  inputIsEscaped: false,
};

const replaceWithWildcardsFactory = (
  regex: RegExp,
  replacements: WildcardReplacements,
  opts?: ReplacementOptions
) => {
  const options = { ...defaultReplacementOptions, ...(opts || {}) };
  return (url = ''): string => {
    const [baseUrl, hash] = url.split('#');
    const [path, query] = baseUrl.split(options.inputIsEscaped ? '\\?' : '?');
    const [hashPath, hashQuery] = (hash || '').split(
      options.inputIsEscaped ? '\\?' : '?'
    );
    let wildcardUrl = path.replace(regex, replacements.path);
    if (
      options.consumeRemainingIfAtEnd &&
      wildcardUrl.endsWith(replacements.path) &&
      !query &&
      !hash
    ) {
      wildcardUrl =
        wildcardUrl.substring(
          0,
          wildcardUrl.length - replacements.path.length
        ) + replacements.pathAll;
    }
    if (query) {
      wildcardUrl += `${options.escape ? '\\' : ''}?${query.replace(
        regex,
        replacements.query
      )}`;
    }
    if (hash) {
      wildcardUrl += `#${hashPath.replace(
        regex,
        hashPath.includes('/') ? replacements.hashPath : replacements.hash
      )}`;
      if (hashQuery) {
        wildcardUrl += `${options.escape ? '\\' : ''}?${hashQuery.replace(
          regex,
          replacements.hashQuery
        )}`;
      }
    }

    return wildcardUrl;
  };
};

export const parseWildcardsInUrl = replaceWithWildcardsFactory(
  uuidRegex,
  wildcardReplacements
);

export const displayUrlToWildcardUrl = replaceWithWildcardsFactory(
  displayUrlWildcardRegex,
  wildcardReplacements,
  { consumeRemainingIfAtEnd: true }
);

export const wildcardUrlToDisplayUrl = replaceWithWildcardsFactory(
  wildcardDisplayUrlRegex,
  displayUrlReplacements,
  { inputIsEscaped: true, escape: false }
);

/**
 * Whether the URL contains wildcards or dynamic attributes.
 */
export const isDynamicUrl = (url: string): boolean => {
  return url.search(DYNAMIC_ATTRIBUTE_REGEX) !== -1 || isWildcardUrl(url);
};

/**
 * Whether the URL contains wildcards.
 */
export const isWildcardUrl = (url: string): boolean => {
  return Object.values(wildcardReplacements).some((wildcard) =>
    url.includes(wildcard)
  );
};
