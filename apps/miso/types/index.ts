import { FormFactorStyle, StepType } from 'bento-common/types';
import { StepEventMappingRuleRuleType } from 'relay-types/EditModuleQuery.graphql';
import { EditorNode } from 'bento-common/types/slate';
import {
  NpsEndingType,
  NpsFollowUpQuestionSettings,
  NpsFollowUpQuestionType,
  NpsPageTargetingType,
  NpsStartingType,
  NpsSurveyState,
} from 'bento-common/types/netPromoterScore';
import { CommonTargeting } from 'bento-common/types/targeting';
import { FormattedRules } from 'components/EditorCommon/types';
import { GenericPriorityFormValues } from 'components/Templates/Tabs/PriorityRankingForm/helpers';
import { StepPrototypeValue } from 'bento-common/types/templateData';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

/** Type of a Material Icon imported SVG */
export type MuiSvgIcon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;

export enum AccountStatus {
  active = 'active',
  archived = 'archived',
}

export enum OrganizationStateType {
  active = 'active',
  trial = 'trial',
  inactive = 'inactive',
}

export enum BentoComponentsEnum {
  legacy = 'bento-embed',
  inline = 'bento-embed',
  inlineContext = 'bento-embed',
  sidebar = 'bento-sidebar',
  context = 'bento-context',
  modal = 'bento-modal',
  banner = 'bento-banner',
  tooltip = 'bento-tooltip',
}

/**
 * Form factors that are part of the combination
 * of many individual form factors, either of the same
 * type or different.
 */
export enum ComposedComponentsEnum {
  /** Uses: tooltip. */
  flow = 'flow',
}

export enum CustomApiEventTypes {
  Event = 'event',
  EventProperty = 'event-property',
}

export interface CustomApiEvent {
  entityId: string;
  name: string;
  type: CustomApiEventTypes;
}

export interface StepEventMappings {
  readonly entityId: string;
  readonly eventName: string;
  readonly completedForWholeAccount?: boolean;
}

export interface EventMappingValue {
  propertyName?: string;
  valueType?: 'text' | 'boolean' | 'date' | 'number';
  ruleType?: StepEventMappingRuleRuleType;
  numberValue?: number;
  textValue?: string;
  booleanValue?: boolean;
  dateValue?: string;
}

export interface NpsFormValue {
  npsSurveyData: {
    entityId: string;
    name: string | null;
    deletedAt: Date | null;
    launchedAt: string | null;
    question: string;
    fupType: NpsFollowUpQuestionType;
    fupSettings: NpsFollowUpQuestionSettings;
    state: NpsSurveyState;
    priorityRanking: number;
    pageTargeting: { type: NpsPageTargetingType; url?: string } | null;
    startingType: NpsStartingType;
    endingType: NpsEndingType;
    startAt: string | null;
    endAt: string | null;
    endAfterTotalAnswers: number | null;
    targets: CommonTargeting<FormattedRules>;
    repeatInterval: number | null;
  };
  priorityRankings: GenericPriorityFormValues;
}

export type LaunchOrPauseNpsSurveyResponse = {
  entityId: any;
  id: string;
  launchedAt: any;
  startAt: any;
  state: NpsSurveyState;
};

/**
 * Generic Step typing
 * Ideally pulled from relay
 */
export interface StepValue {
  entityId?: string;
  name: string;
  body?: string | undefined;
  bodySlate: EditorNode[] | undefined;
  stepType?: StepType;
  createdFromStepPrototypeEntityId?: string;
  taggedElements?: any[];
  dismissLabel?: string;
  snappyAt?: Date;
}

/**
 * Generic Module typing
 * Ideally pulled from relay
 */
export interface ModuleValue {
  name: string;
  entityId?: string | undefined;
  displayTitle?: string;
  createdFromModuleEntityId?: string;
  steps: StepValue[] | StepPrototypeValue[];
}

/**
 * Generic Guide typing
 * Ideally pulled from relay
 */
export interface GuideValue {
  guideModules: any;
  state: any;
  formFactorStyle: FormFactorStyle;
  entityId: string;
  name: string;
  modules: ModuleValue[];
}

/** Format needed for dropdown selector */
export interface ModuleOption {
  value: string;
  label: string;
  description?: string;
  meta?: {
    /** Branching types that the module has. */
    branchingTypes?: string[];
  };
}

export enum FloatingElementUIPosition {
  bottomRight = 'bottom-right',
  bottomLeft = 'bottom-left',
}

export enum BranchingFieldByType {
  guide = 'templateEntityId',
  module = 'moduleEntityId',
}

export enum BranchingFormFactor {
  Cards = 'cards',
  Dropdown = 'dropdown',
}
