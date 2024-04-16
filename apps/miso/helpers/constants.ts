import {
  GuideTypeEnum,
  StepCompletion,
  StepCtaType,
  StepType,
} from 'bento-common/types';
import { FormEntityType } from 'components/GuideForm/types';
import env from '@beam-australia/react-env';
import { ExtendedSelectOptions } from 'system/Select';

export const NEW_TEMPLATE_CREATED_KEY = 'bento-newTemplateCreated';

export const BUTTON_INTERACTION_NO_TEXT = 'No text';

export const MODAL_TYPE_LABELS = {
  [StepCtaType.complete]: 'Close modal',
};

export const BANNER_TYPE_LABELS = {
  [StepCtaType.complete]: 'Close banner',
};

export const CTA_TYPE_LABELS = {
  [StepCtaType.back]: 'Go to previous step',
  [StepCtaType.next]: 'Go to next step',
  [StepCtaType.complete]: 'Mark step as complete',
  [StepCtaType.skip]: 'Skip step',
  [StepCtaType.save]: 'Save for later',
  [StepCtaType.url]: 'Go to link',
  [StepCtaType.launch]: 'Launch a guide',
  [StepCtaType.urlComplete]: 'Go to link and complete step',
  [StepCtaType.event]: 'Fire an event to your app',
};

export const CTA_TYPE_SUBLABELS = {
  [StepCtaType.skip]:
    'When skipped, step still shows in list for user to return to',
  [StepCtaType.save]: 'Announcement can be reaccessed via "Resource center"',
};

export const CTA_TYPE_OPTIONS: ExtendedSelectOptions<StepCtaType>[] = [
  {
    label: CTA_TYPE_LABELS[StepCtaType.back],
    value: StepCtaType.back,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.next],
    value: StepCtaType.next,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.complete],
    value: StepCtaType.complete,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.skip],
    subLabel: CTA_TYPE_SUBLABELS[StepCtaType.skip],
    value: StepCtaType.skip,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.save],
    subLabel: CTA_TYPE_SUBLABELS[StepCtaType.save],
    value: StepCtaType.save,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.url],
    value: StepCtaType.url,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.launch],
    value: StepCtaType.launch,
  },
  {
    label: CTA_TYPE_LABELS[StepCtaType.event],
    value: StepCtaType.event,
  },
];

export const COMPLETION_OPTIONS: ExtendedSelectOptions[] = [
  {
    label: 'Manual',
    subLabel: 'User must manually check each step off.',
    value: StepCompletion.manual,
  },
  {
    label: 'Automatic (data)',
    subLabel: 'Automatically complete steps based on actions or attributes.',
    value: StepCompletion.auto,
  },
  {
    label: 'Automatic (button click)',
    subLabel: 'Pick an element in your app that completes the step.',
    value: StepCompletion.autoInteraction,
  },
];

export const STEP_TYPE_LABELS = {
  [StepType.required]: 'Action',
  [StepType.fyi]: 'Information',
  [StepType.branching]: 'Branching',
  [StepType.branchingOptional]: 'Branching',
  [StepType.input]: 'Input',
};

export const STEP_TYPE_SUB_LABELS = {
  [StepType.required]:
    'A step that has the user taking an action in your application',
  [StepType.fyi]: 'More of an FYI for the user (like an intro video)',
  [StepType.input]:
    'Have a user fill out a text field, or ask for an NPS score',
};

/** Width for module or step list when editing guides */
export const EDITOR_LEFT_WIDTH = '512px';

/** Size for "large" Bento Spinners */
export const TABLE_SPINNER_SIZE = 50;

/**
 * @todo URGENT! fix the `GuideTypeEnum.pre` option
 */
export const GuideTypeLabels = {
  [GuideTypeEnum.account]: 'Account',
  [GuideTypeEnum.user]: 'User',
  [GuideTypeEnum.template]: 'Template',
};

export enum GuideDesignLabels {
  inline = 'Inline',
  sidebar = 'Sidebar',
}

/**
 * User-facing alias for modules
 * @todo move to common/utils/naming
 **/
export const MODULE_ALIAS_SINGULAR = 'step group';
/**
 * If used as a title
 * @todo move to common/utils/naming
 **/
export const MODULE_ALIAS_PLURAL = `${MODULE_ALIAS_SINGULAR}s`;

export const NO_MODULE_PLACEHOLDER = 'nope';

export enum MainFormKeys {
  module = 'moduleData',
  guide = 'guideData',
  template = 'templateData',
  nps = 'npsSurveyData',
}

export enum FormKeys {
  autoLaunch = 'autoLaunch',
  priorityRanking = 'priorityRanking',
  targeting = 'targeting',
}

export const FormDefaultConfirmed = {
  [FormKeys.autoLaunch]: false,
  [FormKeys.priorityRanking]: undefined,
  // Confirmation ignored for the last item.
  [MainFormKeys.template]: undefined,
};

/**
 * Note pulled from TemplateProvider:
 * (MainFormKeys.template) needs to be called last to not unpublish visual tags
 * wrongly evaluating the current template targeting,
 * that might already have been changed but not yet committed
 * by the "edit template settings" handler.
 */
export const EditTemplateFormRanks = {
  [FormKeys.autoLaunch]: 0,
  [FormKeys.priorityRanking]: 1,
  [MainFormKeys.template]: 2,
};

export const getRootFormKey = (formEntityType: FormEntityType) => {
  switch (formEntityType) {
    case FormEntityType.template: {
      return MainFormKeys.template;
    }
    case FormEntityType.guideBase: {
      return MainFormKeys.guide;
    }
    case FormEntityType.module: {
      return MainFormKeys.module;
    }
  }
};

export const isGuideBase = (formEntityType: FormEntityType) =>
  formEntityType === FormEntityType.guideBase;

export const isTemplate = (formEntityType: FormEntityType) =>
  formEntityType === FormEntityType.template;

export const isModule = (formEntityType: FormEntityType) =>
  formEntityType === FormEntityType.module;

export const formEntityTypeLabel = (formEntityType: FormEntityType) =>
  isModule(formEntityType) ? 'module' : 'guide';

/** Since NODE_ENV builds staging as production and we don't have another env */
export const DEPLOYED_TO_PRODUCTION =
  env('CLIENT_HOST')?.includes('/everboarding');

export const API_HOST = env('API_HOST') || '';

export const ACTIVE_STEP_LIST_EVENT = 'step-list-step-expanded';

export const MID_STEP_COUNT = 5;

export const LONG_STEP_COUNT = 7;

/**
 * Used for debouncing queries on user input, etc.
 *   Centralized for a consistent experience.
 */
export const QUERY_DEBOUNCE_DELAY = 500;

/**
 * How long to wait before triggering a hover popover, such as
 * template or NPS details
 */
export const DETAILS_POPOVER_TRIGGER_DELAY = 500;
