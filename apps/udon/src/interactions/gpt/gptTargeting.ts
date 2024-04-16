import { keyBy } from 'lodash';

import { AttributeType, GptErrors } from 'bento-common/types';
import { GroupTargeting, TargetValueType } from 'bento-common/types/targeting';
import { crawlForKey } from 'bento-common/utils/objects';
import {
  castOrTransformByValueType,
  iterateRules,
} from 'bento-common/utils/targeting';

import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import {
  handleGptDateAttribute,
  RivetGraphIds,
  runRivetGraph,
} from './gpt.helpers';
import InvalidRequestError from 'src/errors/InvalidRequest';
import InvalidPayloadError from 'src/errors/InvalidPayloadError';
import fetchAttributesForOrganization from '../targeting/fetchAttributesForOrganization';
import { Organization } from 'src/data/models/Organization.model';
import InvalidAuthPayloadError from 'src/errors/InvalidAuthPayloadError';
import GptTokenError from 'src/errors/GptTokenError';

import { logger } from 'src/utils/logger';

type Args = {
  prompt: string;
  organization: Organization;
};

/** Convert to JSON array string */
const stringifyArrList = (customAttributes: string[]) =>
  JSON.stringify(customAttributes ?? []);

type TargetingGptResult = {
  output: GroupTargeting;
  eventContext?: Record<string, number | string>;
};

/**
 * Get attributes available to GPT
 * Categorize them by primitive vs. non primitive so they can be
 * mapped to the correct schema
 */
export const getCategorizedAttrLists = async (organization: Organization) => {
  const availableAttributes = await fetchAttributesForOrganization({
    organization,
  });

  if (!availableAttributes.length) {
    throw new Error('No attributes found');
  }

  let accountAttributesCount = 0;
  let accountUserAttributesCount = 0;

  /** Create a hash of categorized attribute buckets */
  const availableAttributesByType = availableAttributes.reduce(
    (a, attr) => {
      const isStringArr = attr.valueType === TargetValueType.stringArray;
      if (attr.type === AttributeType.account) {
        accountAttributesCount++;
        isStringArr
          ? a.availableAccountArrayAttributes.push(attr.name)
          : a.availableAccountAttributes.push(attr.name);
      } else {
        accountUserAttributesCount++;
        isStringArr
          ? a.availableUserArrayAttributes.push(attr.name)
          : a.availableUserAttributes.push(attr.name);
      }

      return a;
    },
    {
      availableAccountAttributes: [] as string[],
      availableUserAttributes: [] as string[],
      availableAccountArrayAttributes: [] as string[],
      availableUserArrayAttributes: [] as string[],
    }
  );

  return {
    availableAttributesByType,
    accountAttributesCount,
    accountUserAttributesCount,
  };
};

/** Check we did generate some rule groups */
const validateRulesGenerated = (rules: GroupTargeting | string) => {
  if (typeof rules === 'string') {
    logger.warn(`[gptTargeting] GPT didn't return a json: ${rules}`);
    throw new InvalidRequestError(GptErrors.apiError);
  } else if (!rules.account || !rules.accountUser) {
    logger.warn(`[gptTargeting] GPT return bad JSON`, rules);
    throw new InvalidPayloadError(GptErrors.noContent);
  }

  const ruleGroups =
    (rules.account.groups?.length ?? 0) +
    (rules.accountUser.groups?.length ?? 0);

  if (ruleGroups === 0) throw new InvalidPayloadError(GptErrors.noContent);

  return rules;
};

export default async function targetingGpt({
  organization,
  prompt,
}: Args): Promise<TargetingGptResult> {
  try {
    if (!organization)
      throw new InvalidAuthPayloadError('Invalid organization');

    const {
      availableAttributesByType,
      accountAttributesCount,
      accountUserAttributesCount,
    } = await getCategorizedAttrLists(organization);

    const rivetResult = await runRivetGraph(RivetGraphIds.createTargeting, {
      availableAccountAttributes: stringifyArrList(
        availableAttributesByType.availableAccountAttributes
      ),
      availableUserAttributes: stringifyArrList(
        availableAttributesByType.availableUserAttributes
      ),
      availableAccountArrayAttributes: stringifyArrList(
        availableAttributesByType.availableAccountArrayAttributes
      ),
      availableUserArrayAttributes: stringifyArrList(
        availableAttributesByType.availableUserArrayAttributes
      ),
      userInput: prompt,
    });

    const rawOutput = rivetResult;

    const output = validateRulesGenerated(rawOutput);

    return {
      output,
      eventContext: {
        accountAttributesCount,
        accountUserAttributesCount,
      },
    };
  } catch (error: any) {
    const errorMessage: string = error.message ?? '';

    /* gpt unreachable */
    if (errorMessage.includes('fetch failed')) {
      throw new InvalidRequestError(GptErrors.apiError);
    }

    /* token error */
    if (error.message?.match(/handle ([0-9]+) tokens/)) {
      throw new GptTokenError();
    }

    logger.error('[gptTargeting] Error generating:', error);

    throw error;
  }
}

/**
 * Cast attribute types and additional post-processing
 */
export async function applyAttributeTypes(
  targeting: GroupTargeting,
  organization: Organization
) {
  const attributesAvailable = await fetchAttributesForOrganization({
    organization,
  });

  const availableAttrsDict = keyBy(attributesAvailable, 'name');

  iterateRules(targeting, (rule) => {
    const rawValue = rule.value as string;
    const originalAttr = availableAttrsDict[rule.attribute];

    if (!originalAttr)
      throw new InvalidPayloadError('Invalid attribute provided');

    if (originalAttr.valueType === TargetValueType.date) {
      /** Handle separate as it is gpt-specific, unlike general casting */
      rule.value = handleGptDateAttribute(rawValue);
    } else {
      rule.value = castOrTransformByValueType(rawValue, originalAttr.valueType);
    }
  });

  return targeting;
}

/**
 * Check that we are using actual attributes so we don't send
 *   bad data to miso that'll cause problems
 */
export async function validateAttributesUsed(
  targeting: GroupTargeting,
  organizationId: number
) {
  try {
    const requestedValues = crawlForKey<string>(targeting, 'attribute');

    const attributesAvailable = await CustomAttribute.findAll({
      where: {
        name: requestedValues,
        organizationId,
      },
      attributes: ['name'],
    });

    const availableAttrsDict = keyBy(attributesAvailable, 'name');

    return requestedValues.every((attr) => !!availableAttrsDict[attr]);
  } catch (e) {
    return false;
  }
}
