import {
  Describe,
  assert,
  define,
  optional,
  object,
  string,
  boolean,
  number,
  date,
  record,
  nullable,
  type,
  union,
  Struct,
  nonempty,
  size,
  max,
} from 'superstruct';

import { BentoSettings, DynamicAttributes } from 'bento-common/types';
import {
  AppId,
  DateString,
  Email,
  IsoDate,
  ValidString,
  ATTRIBUTE_KEY_MAX_LENGTH,
  ATTRIBUTE_VALUE_MAX_LENGTH,
  MAX_CUSTOM_ATTRIBUTES_COUNT,
  withMessage,
  CustomAttribute,
} from './customRules';
import { omit, pick } from '../utils/lodash';

/**
 * @todo improve type definitions (udon was complaining wo/ casting)
 */

export const DynamicAttributesSchema = record(
  size(string(), 1, ATTRIBUTE_KEY_MAX_LENGTH),
  CustomAttribute
) as Describe<DynamicAttributes>;

// Intentionally not being strict here, so we allow
// ISO8601 date strings, other date strings or Date objects.
const DateAttr = optional(
  nullable(union([IsoDate, DateString, date()]))
) as Struct<string, null>;

export const ExpectedAccountSchema = type({
  id: size(nonempty(string()), 1, ATTRIBUTE_VALUE_MAX_LENGTH),
  name: size(ValidString, 1, ATTRIBUTE_VALUE_MAX_LENGTH),
  createdAt: DateAttr,
}) as Describe<Pick<BentoSettings['account'], 'id' | 'name' | 'createdAt'>>;

export const ExpectedAccountUserSchema = type({
  id: nonempty(size(string(), 1, ATTRIBUTE_VALUE_MAX_LENGTH)),
  email: optional(nullable(Email)),
  fullName: optional(nullable(size(string(), 1, ATTRIBUTE_VALUE_MAX_LENGTH))),
  createdAt: DateAttr,
}) as Describe<
  Pick<BentoSettings['accountUser'], 'id' | 'email' | 'fullName' | 'createdAt'>
>;

/**
 * Validates bentoSettings.[account,accountUser] objects in two steps
 * to avoid using an union type since it would mess up with error messages
 * thrown by superstruct.
 */
export const idFactory = <S>(
  KnownSchema: typeof ExpectedAccountSchema | typeof ExpectedAccountUserSchema,
  key: string,
  knownFields: (
    | Partial<keyof BentoSettings['account']>
    | Partial<keyof BentoSettings['accountUser']>
  )[]
) => {
  return define<S>(`bentoSettings.${key}`, (complexObj: any) => {
    // validate known fields first
    assert(
      { [key]: pick(complexObj, knownFields) },
      object({ [key]: KnownSchema })
    );

    const customAttrs = omit(complexObj, knownFields);

    // validate custom fields afterwards
    assert({ [key]: customAttrs }, type({ [key]: DynamicAttributesSchema }));

    const keysCount = Object.keys(customAttrs).length;
    assert(
      keysCount,
      withMessage(
        max(number(), MAX_CUSTOM_ATTRIBUTES_COUNT),
        `Expected a maximum of \`${MAX_CUSTOM_ATTRIBUTES_COUNT}\` custom attributes but received \`${keysCount}\``,
        { path: key }
      )
    );

    return true;
  });
};

export const defaultAccountAttributes = ['id', 'name', 'createdAt'];
export const defaultAccountUserAttributes = [
  'id',
  'email',
  'fullName',
  'role',
  'createdAt',
];

export const Account = idFactory<BentoSettings['account']>(
  ExpectedAccountSchema,
  'account',
  defaultAccountAttributes
);

export const AccountUser = idFactory<BentoSettings['accountUser']>(
  ExpectedAccountUserSchema,
  'accountUser',
  defaultAccountUserAttributes
);

/**
 * Should be kept in sync with the Bento installation doc (link below).
 * NOTE: Strange properties will be ignored since we're using `type` struct here.
 *
 * @link https://www.notion.so/Bento-installation-d860652453b34de89420a475df379a8e
 */
export const BentoSettingsSchema: Describe<BentoSettings> = type({
  // core
  appId: AppId,
  account: Account,
  accountUser: AccountUser,
  // other
  chromeExtension: optional(boolean()),
  autoIdentify: optional(boolean()),
  // deprecated
  onigiri: optional(boolean()),
});

/**
 * Assert bentoSettings against schema.
 */
export default function assertBentoSettings(settings: unknown) {
  assert(settings, BentoSettingsSchema);
}
