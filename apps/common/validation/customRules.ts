import {
  Struct,
  define,
  is,
  string,
  pattern,
  optional,
  nullable,
  union,
  date,
  number,
  boolean,
  array,
  refine,
  validate,
  any,
} from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';
import isISODate from 'is-iso-date';
import isUrl from 'is-url';

// Determine the max length of custom attribute key names
export const ATTRIBUTE_KEY_MAX_LENGTH = 64;

// Determine the max length of attribute values (soft for custom attributes)
export const ATTRIBUTE_VALUE_MAX_LENGTH = 128;

// Determine the (hard) max length of custom attribute values
export const CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH = 256;

// Determine the (hard) max length of custom attribute URLs
export const CUSTOM_ATTRIBUTE_URL_MAX_LENGTH = 2048;

// Determine the maximum count of attributes per each namespace (i.e. account)
export const MAX_CUSTOM_ATTRIBUTES_COUNT = 256;

// Matches single quote (aka apostrophe) html encoded chars
export const APOSTROPHE_REGEXP = /&#39;|&#x27;/g;

export const message = (expected, received) =>
  `Expected ${expected}, but received: ${received}`;

export const withMessage = <T>(
  struct: Struct<T, any>,
  message: string,
  options?: {
    path?: string;
    key?: string;
  }
): Struct<T, any> =>
  define(options?.key ?? `${struct.type}`, (value) =>
    is(value, struct)
      ? true
      : options?.path
      ? `At path: ${options.path} -- ${message}`
      : message
  );

export const Email = define<string>(
  'Email',
  (value) => isEmail(value) || message('a valid email', value)
);

export const ValidString = define<string>(
  'string',
  (value: any) =>
    is(
      (typeof value === 'string' && value?.replace(APOSTROPHE_REGEXP, "'")) ||
        value,
      pattern(string(), /[\da-z]/gi)
    ) ||
    message(
      'a valid string (non-empty containing at least one alpha numeric char)',
      value
    )
);

const CustomAttributeString = refine(
  string(),
  'CustomAttributeString',
  (value) => {
    if (isUrl(value)) {
      return (
        value.length <= CUSTOM_ATTRIBUTE_URL_MAX_LENGTH ||
        `Expected a valid url (up to ${CUSTOM_ATTRIBUTE_URL_MAX_LENGTH} characters), but received one with ${value.length} characters.`
      );
    }
    return (
      value.length <= CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH ||
      `Expected a valid string (up to ${CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH} characters), but received one with ${value.length} characters.`
    );
  }
);

const CustomAttributeArray = define<string[]>(
  'CustomAttributeArray',
  (value) => validate(value, array(CustomAttributeString))[0]?.message || true
);

export const Uuid = define<string>(
  'Uuid',
  (value) =>
    isUuid.anyNonNil((value || '') as string) || message('a uuid', value)
);

export const AppId = define<string>(
  'AppId',
  (value) =>
    isUuid.anyNonNil((value || '') as string) ||
    message('a valid Bento App Id', value)
);

export const IsoDate = define<string>(
  'ISO8601 Date',
  (value) => isISODate(value) || message('a valid ISO8601 date string', value)
);

export const IsoDatePart = define<string>(
  'ISO8601 Date part',
  (value) =>
    isISODate(value + 'T00:00Z') ||
    message('a valid ISO8601 date part string', value)
);

export const DateString = define<string>(
  'DateString',
  (value: any) =>
    !Number.isNaN(Date.parse(value || 'invalid')) ||
    message('a valid date string', value)
);

export const CustomAttribute = refine(
  optional(
    nullable(union([string(), date(), number(), boolean(), array(any())]))
  ),
  'CustomAttribute',
  (value) =>
    (typeof value === 'string' &&
      validate(value, CustomAttributeString)[0]?.message) ||
    (Array.isArray(value) &&
      validate(value, CustomAttributeArray)[0]?.message) ||
    true
);

export const Url = define<string>(
  'Url',
  (value) =>
    (typeof value === 'string' && isUrl(value)) || message('a valid URL', value)
);
