import { pick } from 'lodash';
import { GuidePageTargetingType } from 'bento-common/types';
import { isGuideEligibleForTagTargeting } from 'bento-common/utils/constants';

import { StepPrototypeTaggedElement } from 'src/data/models/StepPrototypeTaggedElement.model';
import { StepTaggedElement } from 'src/data/models/StepTaggedElement.model';
import { Template } from 'src/data/models/Template.model';

export const commonTaggedElementFields = [
  'url',
  'wildcardUrl',
  'elementSelector',
  'type',
  'alignment',
  'xOffset',
  'yOffset',
  'relativeToText',
  'tooltipAlignment',
  'style',
];

export const pickCommonTaggedElementFields = <T extends object>(
  target: StepPrototypeTaggedElement | StepTaggedElement | T
) => {
  return pick(target, commonTaggedElementFields);
};

/**
 * Determines whether we should delete template prototype tags due to page targeting
 * settings set to something other than visual tag.
 */
export const shouldDeleteTemplatePrototypeTag = <I extends object>(
  target: Template,
  newSettings: I & {
    pageTargetingType?: GuidePageTargetingType;
  }
) => {
  return (
    isGuideEligibleForTagTargeting(target.designType) &&
    newSettings.pageTargetingType &&
    newSettings.pageTargetingType !== GuidePageTargetingType.visualTag
  );
};
