import {
  CtaInput,
  FormFactorStyle,
  GuideDesignType,
  GuideExpirationCriteria,
  GuideFormFactor,
  GuidePageTargetingType,
  GuideTypeEnum,
  NotificationSettings,
  StepAutoCompleteInteractionInput,
  StepEventMappingInput,
  StepInputFieldInput,
  StepType,
  TagInput,
  Theme,
} from '.';
import { BranchingFormFactor } from './globalShoyuState';
import { MediaReferenceInput } from './media';
import { EditorNode } from './slate';
import { StepAutoCompleteInteraction } from './stepAutoComplete';

/**
 * Types used for template forms in miso
 * and the WYSIWYG editor in shoyu.
 */

export enum BranchingType {
  guide = 'guide',
  module = 'module',
}

export interface BranchingPathData {
  choiceKey: string;
  label?: string;
  moduleEntityId?: string;
  templateEntityId?: string;
  /** @todo remove entityType from here if we don't actually have it here */
  entityType?: BranchingType;
  branchingKey?: string;
}

export interface StepPrototypeValue {
  entityId: string;
  name: string;
  body: string | undefined;
  bodySlate: EditorNode[] | null | undefined;
  eventMappings?: StepEventMappingInput[];
  autoCompleteInteractions: StepAutoCompleteInteraction[];
  autoCompleteInteraction?: StepAutoCompleteInteractionInput;
  completeForWholeAccount?: boolean;
  stepType: StepType;
  mediaReferences?: MediaReferenceInput[];
  ctas?: CtaInput[];
  taggedElements: TagInput[];
  inputs?: StepInputFieldInput[];
  branchingMultiple?: boolean;
  branchingDismissDisabled?: boolean;
  branchingQuestion?: string;
  branchingEntityType?: BranchingType;
  branchingPathData?: BranchingPathData[];
  branchingFormFactor?: BranchingFormFactor;
  manualCompletionDisabled?: boolean;
  dismissLabel?: string;

  branchingKey?: string;
  branchingChoices?: { choiceKey: string; label: string; style?: any }[];
}

export interface TemplateModuleValue {
  name?: string;
  entityId?: string | undefined;
  stepPrototypes: StepPrototypeValue[];
  displayTitle?: string;
  description?: string;
}

/** Formik value of the top-level EditTemplate forms */
export interface TemplateValue {
  entityId: string;
  type?: GuideTypeEnum;
  name: string | null;
  privateName?: string;
  theme: Theme;
  description?: string;
  formFactor: GuideFormFactor;
  enableAutoLaunchAt: string | null;
  disableAutoLaunchAt: string | null;
  formFactorStyle?: FormFactorStyle;
  isSideQuest: boolean;
  modules: TemplateModuleValue[];
  pageTargetingType: GuidePageTargetingType;
  pageTargetingUrl?: string;
  taggedElements: any[];
  inlineEmbed: any;
  expireBasedOn: GuideExpirationCriteria | null;
  expireAfter: number | null;
  isCyoa: boolean;
  designType: GuideDesignType;
  notificationSettings: NotificationSettings;
}
