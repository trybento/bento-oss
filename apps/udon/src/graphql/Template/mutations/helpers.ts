import isUndefined from 'lodash/isUndefined';
import { array, boolean, mixed, number, object, string } from 'yup';
import { $enum } from 'ts-enum-util';
import {
  BannerPosition,
  BannerTypeEnum,
  GuideFormFactor,
  ModalPosition,
  ModalSize,
  StepInputFieldType,
  TemplateState,
  TooltipShowOn,
  TooltipSize,
  TooltipStyle,
} from 'bento-common/types';

import { Template } from 'src/data/models/Template.model';
import { TemplateInput } from './editTemplate';

type SchedulingFields = {
  enableAutoLaunchAt?: Date | null;
  disableAutoLaunchAt?: Date | null;
};

/**
 * @todo use yup for schema validation and its transforms capabilities
 */
export const validateSchedulingFields = (
  template: Pick<TemplateInput, 'enableAutoLaunchAt' | 'disableAutoLaunchAt'>,
  currentState: TemplateState
) => {
  // Edit the start/end dates only if they are specified in the request. Null values are valid.
  const fields: SchedulingFields = {};
  const now = new Date();

  if (!isUndefined(template.enableAutoLaunchAt)) {
    fields.enableAutoLaunchAt = template.enableAutoLaunchAt
      ? new Date(template.enableAutoLaunchAt)
      : null;
  }

  if (!isUndefined(template.disableAutoLaunchAt)) {
    fields.disableAutoLaunchAt = template.disableAutoLaunchAt
      ? new Date(template.disableAutoLaunchAt)
      : null;
  }

  /**
   * If it's already launched at some point, there's no sense re-validating this
   */
  if (
    fields.enableAutoLaunchAt &&
    fields.enableAutoLaunchAt.getTime() < now.getTime() &&
    currentState === TemplateState.draft
  ) {
    throw new Error(
      'The scheduled date to start launching the guide must be in the future.'
    );
  }

  /**
   * Only validate this if we actually haven't reached the stop yet
   */
  if (
    fields.disableAutoLaunchAt &&
    fields.disableAutoLaunchAt.getTime() < now.getTime() &&
    currentState !== TemplateState.stopped
  ) {
    throw new Error(
      'The scheduled date to stop launching the guide must be in the future.'
    );
  }
  if (
    fields.enableAutoLaunchAt &&
    fields.disableAutoLaunchAt &&
    fields.disableAutoLaunchAt.getTime() <= fields.enableAutoLaunchAt.getTime()
  ) {
    throw new Error(
      'The scheduled date to stop launching the guide must be after the scheduled date to start launching the guide.'
    );
  }

  return fields;
};

export const validateFormFactorStyles = async (
  template: Template,
  templateData: TemplateInput
) => {
  switch (template.formFactor) {
    case GuideFormFactor.banner:
      await bannerFormFactorStyleSchema.validate(templateData?.formFactorStyle);
      break;

    case GuideFormFactor.modal:
      await modalFormFactorStyleSchema.validate(templateData?.formFactorStyle);
      break;

    case GuideFormFactor.tooltip:
    case GuideFormFactor.flow:
      await tooltipFormFactorStyleSchema.validate(
        templateData?.formFactorStyle
      );

      // cast values before saving
      templateData.formFactorStyle = tooltipFormFactorStyleSchema.cast(
        templateData?.formFactorStyle
      ) as TooltipStyle;

      break;

    default:
      break;
  }
};

export const bannerFormFactorStyleSchema = object({
  bannerPosition: mixed<BannerPosition>()
    .required()
    .oneOf($enum(BannerPosition).getValues()),
  bannerType: mixed<BannerTypeEnum>()
    .required()
    .oneOf($enum(BannerTypeEnum).getValues()),
});

export const modalFormFactorStyleSchema = object({
  hasBackgroundOverlay: boolean().required(),
  modalSize: mixed<ModalSize>().required().oneOf($enum(ModalSize).getValues()),
  position: mixed<ModalPosition>()
    .required()
    .oneOf($enum(ModalPosition).getValues()),
  backgroundColor: string().hexColor().nullable(),
  textColor: string().hexColor().nullable().optional().castEmptyToNull(),
});

export const tooltipFormFactorStyleSchema = object({
  backgroundColor: string().hexColor().nullable(),
  backgroundOverlayColor: string().hexColor().nullable().castEmptyToNull(),
  backgroundOverlayOpacity: number().min(0).max(100).nullable(),
  hasArrow: boolean().required(),
  hasBackgroundOverlay: boolean().optional(),
  textColor: string().hexColor().nullable().optional().castEmptyToNull(),
  tooltipSize: mixed<TooltipSize>()
    .required()
    .oneOf($enum(TooltipSize).getValues()),
  tooltipShowOn: mixed<TooltipShowOn>()
    .required()
    .oneOf($enum(TooltipShowOn).getValues()),
});

export const inputFieldsSchema = array(
  object({
    entityId: string().nullable().optional(),
    label: string().nullable(false).optional(),
    type: mixed<StepInputFieldType>()
      .required()
      .oneOf($enum(StepInputFieldType).getValues()),
    settings: object({
      required: boolean().optional(),
      helperText: string().nullable().optional(),
      placeholder: string().nullable().optional(),
      minValue: number().nullable().optional().integer(),
      maxValue: number().nullable().optional().integer(),
      minLabel: string().nullable().optional(),
      maxLabel: string().nullable().optional(),
    }).required(),
  })
);
