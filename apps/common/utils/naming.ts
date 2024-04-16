import { isObject } from 'lodash';
import { GuideFormFactor, Theme } from '../types';
import { isFlowGuide, isSingleStepGuide } from './formFactor';

/** User-facing alias for modules */
export const MODULE_ALIAS_SINGULAR = 'step group';
/** If used as a title */
export const MODULE_ALIAS_PLURAL = `${MODULE_ALIAS_SINGULAR}s`;

export const EMPTY_SURVEY_NAME = '(untitled survey)';
export const EMPTY_STEP_NAME = '(untitled step)';
export const EMPTY_MODULE_NAME = `(untitled ${MODULE_ALIAS_SINGULAR})`;
export const EMPTY_GUIDE_NAME = '(untitled guide)';
export const EMPTY_SPLIT_TEST_NAME = '(untitled test)';

type NamedObject = {
  /**
   * Means either the public (for template/gb/guides) or private name (for step groups).
   */
  name?: string | null;
  /**
   * Object's public name
   * WARNING: This is deprecated for templates, please use `name` instead.
   *
   * @deprecated will be removed in the near future
   */
  displayTitle?: string | null;
  /**
   * Means the explicit private name
   * WARNING: Currently only supported by Templates.
   */
  privateName?: string | null;
};

const nameOrFallbackFactory = (fallback: string) => {
  return (
    nameOrObject?: NamedObject | Readonly<NamedObject> | string | null
  ) => {
    if (isObject(nameOrObject)) {
      return nameOrObject.displayTitle || nameOrObject.name || fallback;
    }
    return nameOrObject || fallback;
  };
};

export const stepNameOrFallback = nameOrFallbackFactory(EMPTY_STEP_NAME);
export const moduleNameOrFallback = nameOrFallbackFactory(EMPTY_MODULE_NAME);

/**
 * NOTE: If you're using this in the Admin context, then you likely want to use
 * `guidePrivateOrPublicNameOrFallback` instead to have private vs public names
 * handled for you accordingly to the feature flag.
 */
export const guideNameOrFallback = nameOrFallbackFactory(EMPTY_GUIDE_NAME);
export const splitTestNameOrFallback = nameOrFallbackFactory(
  EMPTY_SPLIT_TEST_NAME
);
export const npsNameOrFallback = nameOrFallbackFactory(EMPTY_SURVEY_NAME);

/**
 * Determine if the guide supports such a concept as private names
 */
export const nameAndPrivateNameShouldMatch = (
  formFactor: GuideFormFactor | undefined,
  theme: Theme | undefined
): boolean => isSingleStepGuide(theme, formFactor) || isFlowGuide(formFactor);

/**
 * Based on whether the internal names feature is available, this will give precedence to the private name
 * over the public name, while still having a fallback for cases where both are missing.
 *
 * WARNING: Should only be used inside the Admin context since end-users should NEVER see internal names.
 */
export const guidePrivateOrPublicNameOrFallback = (
  /** Whether the private name feature is enabled for this Org */
  featureEnabled: boolean,
  /** Template or guide/base object */
  guideOrTemplateObject:
    | Pick<NamedObject, 'name' | 'privateName'>
    | Readonly<Pick<NamedObject, 'name' | 'privateName'>>
    | undefined
    | null
): string => {
  if (featureEnabled) {
    return guideNameOrFallback(
      guideOrTemplateObject?.privateName || guideOrTemplateObject?.name
    );
  }
  return guideNameOrFallback(guideOrTemplateObject?.name);
};
