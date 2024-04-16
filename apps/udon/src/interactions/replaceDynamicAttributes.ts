import deepMap from 'deep-map';
import { DynamicAttributes } from 'bento-common/types';
import { interpolateAttributes } from 'bento-common/data/helpers';
import { SlateBodyElement } from 'bento-common/types/slate';

import { fetchAttributesForAccount } from './targeting/fetchAttributesForAccount';
import { fetchAttributesForAccountUser } from './targeting/fetchAttributesForAccountUser';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Account } from 'src/data/models/Account.model';

const BLANK_BODY_SLATE = [];

export function replaceBodySlateDynamicAttributes(
  bodySlate: SlateBodyElement[] | null | undefined,
  attributes: DynamicAttributes
) {
  if (!bodySlate || bodySlate.length === 0) return BLANK_BODY_SLATE;

  const bodySlateWithInterpolatedValues = deepMap(
    bodySlate,
    (uncastContent: unknown) => {
      return interpolateAttributes(uncastContent, attributes);
    }
  );

  return bodySlateWithInterpolatedValues;
}

export function fetchAndMapDynamicAttributes(
  account: Account,
  accountUser: AccountUser
): DynamicAttributes {
  const attributes = {};

  const accountAttrs = fetchAttributesForAccount({ account });
  const userAttrs = fetchAttributesForAccountUser({ accountUser });

  for (const [key, value] of Object.entries(accountAttrs)) {
    attributes[`account:${key}`] = value;
  }

  for (const [key, value] of Object.entries(userAttrs)) {
    attributes[`user:${key}`] = value;
  }

  return attributes;
}
