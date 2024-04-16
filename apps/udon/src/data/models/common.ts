import { Model } from 'sequelize-typescript';
import {
  GuideDesignType,
  GuideFormFactor,
  GuideBaseState,
  TemplateState,
  SplitTestState,
} from 'bento-common/types';
import { isSplitTestGuide } from 'bento-common/data/helpers';

import { GuideBase } from './GuideBase.model';
import { Template } from './Template.model';
import { logger } from 'src/utils/logger';

/**
 * Determines which fields of Models are immutables.
 * Useful to restrict which fields should get updated based on input coming from user/API.
 **/
export const commonImmutableFields = [
  'id',
  'entityId',
  'organizationId',
  'createdAt',
  'updatedAt',
];

export function rawDesignTypeGetter(
  isSideQuest: boolean,
  formFactor: GuideFormFactor
): GuideDesignType {
  if (isSideQuest) {
    return [GuideFormFactor.modal, GuideFormFactor.banner].includes(formFactor!)
      ? GuideDesignType.announcement
      : GuideDesignType.everboarding;
  }

  return GuideDesignType.onboarding;
}

export function guideDesignTypeGetter(this: Template): GuideDesignType {
  const isSideQuest = this.getDataValue('isSideQuest');
  const formFactor = this.getDataValue('formFactor');

  if (typeof isSideQuest !== 'boolean' || typeof formFactor !== 'string') {
    throw new Error('Failed to compute design type');
  }

  return rawDesignTypeGetter(
    !!this.getDataValue('isSideQuest'),
    this.getDataValue('formFactor')
  );
}

export function guideDesignTypeSetter(_value: unknown): void {
  throw new Error('Cannot manually set the design type');
}

export const getGuideBaseState = (guideBase: GuideBase) => {
  if (guideBase.obsoletedAt) {
    return GuideBaseState.obsoleted;
  }

  return guideBase.state as unknown as GuideBaseState;
};

export const getTemplateState = ({
  template,
}: {
  template: Pick<Template, 'state' | 'manuallyLaunched'>;
}) => {
  /**
   * If the template has been manually launched, and is in either
   * a draft or stopped state, then override the state with live.
   */
  if (
    template.manuallyLaunched &&
    [TemplateState.draft, TemplateState.stopped].includes(template.state)
  ) {
    return TemplateState.live;
  }

  return template.state;
};

export function getSplitTestState({
  hasActiveGuideBases,
  template,
}: {
  template: Pick<Template, 'type' | 'isAutoLaunchEnabled' | 'deletedAt'>;
  hasActiveGuideBases: boolean;
}): SplitTestState {
  if (!isSplitTestGuide(template.type)) {
    return SplitTestState.none;
  }

  if (template.deletedAt) {
    return SplitTestState.deleted;
  }

  if (template.isAutoLaunchEnabled) {
    return SplitTestState.live;
  }

  if (hasActiveGuideBases) {
    return SplitTestState.stopped;
  }

  return SplitTestState.draft;
}

/**
 * Compute default values of a Model.
 * Useful to preemptively fill defaulted values that can contain values expressed as
 * functions instead of literals.
 */
export const computeDefaultValues = <T extends object>(
  defaults: Record<string, any>
) => {
  return Object.keys(defaults).reduce((acc, key) => {
    if (typeof defaults[key] === 'function') {
      acc[key] = defaults[key]();
    } else {
      acc[key] = defaults[key];
    }
    return acc;
  }, {} as T);
};

export function deprecatedSetter(modelName: string, fieldName: string) {
  return function <T extends Model>(this: T, value: unknown) {
    const err = new Error(
      `Implementation error. Should not set deprecated field (${modelName}.${fieldName})`
    );
    this.setDataValue(fieldName, value);
    logger.error(err);
  };
}
