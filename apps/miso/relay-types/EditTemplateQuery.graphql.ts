/**
 * @generated SignedSource<<45fe1847a5bc46ec4c8890178676be1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AutoCompleteInteractionType = "guide_completion";
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type BranchingFormFactorEnumType = "cards" | "dropdown";
export type BranchingPathEntityType = "guide" | "module" | "template";
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type DropdownInputVariationEnumType = "cards" | "dropdown";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideExpirationCriteria = "launch" | "never" | "step_completion";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type InputStepFieldTypeEnumType = "date" | "dropdown" | "email" | "nps" | "numberPoll" | "paragraph" | "text";
export type MediaOrientation = "left" | "right";
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type NpsStartingTypeEnumType = "date_based" | "manual";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
export type StepAutoCompleteInteractionTypeEnumType = "click";
export type StepBodyOrientation = "horizontal" | "vertical";
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
export type StepEventMappingRuleRuleType = "eq" | "gt" | "gte" | "lt" | "lte";
export type StepEventMappingRuleValueType = "boolean" | "date" | "number" | "text";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
export type EditTemplateQuery$variables = {
  templateEntityId: any;
};
export type EditTemplateQuery$data = {
  readonly autoLaunchableTemplates: ReadonlyArray<{
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly launchedAt: any | null;
    readonly name: string | null;
    readonly priorityRanking: number;
    readonly privateName: string | null;
    readonly splitTargets: ReadonlyArray<{
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
    } | null>;
    readonly type: GuideTypeEnumType;
  }>;
  readonly launchedNpsSurveys: ReadonlyArray<{
    readonly entityId: any;
    readonly launchedAt: any | null;
    readonly name: string;
    readonly priorityRanking: number;
    readonly startingType: NpsStartingTypeEnumType;
  }>;
  readonly template: {
    readonly archivedAt: any | null;
    readonly description: string | null;
    readonly designType: GuideDesignTypeEnumType;
    readonly disableAutoLaunchAt: any | null;
    readonly editedAt: any | null;
    readonly enableAutoLaunchAt: any | null;
    readonly entityId: any;
    readonly expireAfter: number | null;
    readonly expireBasedOn: GuideExpirationCriteria;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly formFactorStyle: {
      readonly advancedPadding?: string | null;
      readonly backgroundColor?: string | null;
      readonly backgroundOverlayColor?: string | null;
      readonly backgroundOverlayOpacity?: number | null;
      readonly bannerPosition?: BannerPosition;
      readonly bannerType?: BannerType;
      readonly borderColor?: string | null;
      readonly borderRadius?: number | null;
      readonly canDismiss?: boolean | null;
      readonly ctasOrientation?: CtasOrientation | null;
      readonly dotsColor?: string | null;
      readonly hasArrow?: boolean;
      readonly hasBackgroundOverlay?: boolean;
      readonly height?: number | null;
      readonly hideCompletedSteps?: boolean | null;
      readonly hideStepGroupTitle?: boolean | null;
      readonly horizontalMediaAlignment?: HorizontalMediaAlignment | null;
      readonly imageWidth?: string | null;
      readonly mediaFontSize?: number | null;
      readonly mediaOrientation?: MediaOrientation | null;
      readonly mediaTextColor?: string | null;
      readonly modalSize?: ModalSize;
      readonly padding?: number | null;
      readonly position?: ModalPosition;
      readonly selectedBackgroundColor?: string | null;
      readonly statusLabelColor?: string | null;
      readonly stepBodyOrientation?: StepBodyOrientation | null;
      readonly textColor?: string | null;
      readonly tooltipShowOn?: TooltipShowOn;
      readonly tooltipSize?: TooltipSize;
      readonly verticalMediaAlignment?: VerticalMediaAlignment | null;
      readonly verticalMediaOrientation?: VerticalMediaOrientation | null;
    } | null;
    readonly hasAutoLaunchedGuideBases: boolean;
    readonly hasGuideBases: boolean;
    readonly inlineEmbed: {
      readonly alignment: InlineEmbedAlignment | null;
      readonly borderRadius: number;
      readonly bottomMargin: number;
      readonly elementSelector: string;
      readonly entityId: any;
      readonly leftMargin: number;
      readonly maxWidth: number | null;
      readonly padding: number;
      readonly position: InlineEmbedPosition;
      readonly rightMargin: number;
      readonly state: InlineEmbedState;
      readonly targeting: {
        readonly account: {
          readonly grouping: string | null;
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueType;
          } | null> | null;
          readonly type: InlineEmbedTargetingType;
        };
        readonly accountUser: {
          readonly grouping: string | null;
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetAttributeRuleRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueType;
          } | null> | null;
          readonly type: InlineEmbedTargetingType;
        };
      };
      readonly template: {
        readonly entityId: any;
      } | null;
      readonly topMargin: number;
      readonly url: string;
      readonly wildcardUrl: string;
    } | null;
    readonly isAutoLaunchEnabled: boolean | null;
    readonly isCyoa: boolean;
    readonly isSideQuest: boolean | null;
    readonly isTargetedForSplitTesting: SplitTestStateEnumType;
    readonly isTemplate: boolean;
    readonly launchedAt: any | null;
    readonly modules: ReadonlyArray<{
      readonly description: string | null;
      readonly displayTitle: string | null;
      readonly entityId: any;
      readonly isCyoa: boolean | null;
      readonly name: string | null;
      readonly stepPrototypes: ReadonlyArray<{
        readonly autoCompleteInteraction: {
          readonly elementHtml: string | null;
          readonly elementSelector: string;
          readonly elementText: string | null;
          readonly type: StepAutoCompleteInteractionTypeEnumType;
          readonly url: string;
          readonly wildcardUrl: string;
        } | null;
        readonly autoCompleteInteractions: ReadonlyArray<{
          readonly interactionType?: AutoCompleteInteractionType | null;
          readonly templateEntityId?: string;
        } | null> | null;
        readonly body: string | null;
        readonly bodySlate: any | null;
        readonly branchingChoices: ReadonlyArray<{
          readonly choiceKey: string | null;
          readonly label: string | null;
          readonly style: {
            readonly backgroundImagePosition?: CYOABackgroundImagePosition;
            readonly backgroundImageUrl?: string | null;
          } | null;
        }> | null;
        readonly branchingDismissDisabled: boolean | null;
        readonly branchingFormFactor: BranchingFormFactorEnumType | null;
        readonly branchingKey: string | null;
        readonly branchingMultiple: boolean | null;
        readonly branchingPaths: ReadonlyArray<{
          readonly choiceKey: string | null;
          readonly entityType: BranchingPathEntityType;
          readonly module: {
            readonly entityId: any;
          } | null;
          readonly moduleEntityId: any | null;
          readonly template: {
            readonly entityId: any;
          } | null;
          readonly templateEntityId: any | null;
        }> | null;
        readonly branchingQuestion: string | null;
        readonly ctas: ReadonlyArray<{
          readonly destinationGuide: string | null;
          readonly entityId: any;
          readonly settings: {
            readonly bgColorField: string;
            readonly eventName: string | null;
            readonly implicit: boolean | null;
            readonly markComplete: boolean | null;
            readonly opensInNewTab: boolean | null;
            readonly textColorField: string;
          } | null;
          readonly style: StepCtaStyleEnumType;
          readonly text: string;
          readonly type: StepCtaTypeEnumType;
          readonly url: string | null;
        }>;
        readonly entityId: any;
        readonly eventMappings: ReadonlyArray<{
          readonly completeForWholeAccount: boolean;
          readonly eventName: string;
          readonly rules: ReadonlyArray<{
            readonly booleanValue: boolean | null;
            readonly dateValue: any | null;
            readonly numberValue: number | null;
            readonly propertyName: string;
            readonly ruleType: StepEventMappingRuleRuleType;
            readonly textValue: string | null;
            readonly valueType: StepEventMappingRuleValueType;
          }>;
        }>;
        readonly inputs: ReadonlyArray<{
          readonly entityId: any;
          readonly label: string;
          readonly settings: {
            readonly helperText?: string | null;
            readonly maxLabel?: string | null;
            readonly maxValue?: number | null;
            readonly minLabel?: string | null;
            readonly minValue?: number | null;
            readonly multiSelect?: boolean;
            readonly options?: ReadonlyArray<{
              readonly label: string | null;
              readonly value: string | null;
            }>;
            readonly placeholder?: string | null;
            readonly required?: boolean;
            readonly variation?: DropdownInputVariationEnumType;
          } | null;
          readonly type: InputStepFieldTypeEnumType;
        }>;
        readonly manualCompletionDisabled: boolean;
        readonly mediaReferences: ReadonlyArray<{
          readonly entityId: any;
          readonly media: {
            readonly meta: {
              readonly naturalHeight?: number | null;
              readonly naturalWidth?: number | null;
              readonly videoId?: string | null;
              readonly videoType?: string | null;
            };
            readonly type: MediaTypeEnumType;
            readonly url: string;
          };
          readonly settings: {
            readonly alignment?: string | null;
            readonly fill?: string | null;
            readonly hyperlink?: string | null;
            readonly lightboxDisabled?: boolean | null;
            readonly playsInline?: boolean | null;
          };
        }>;
        readonly name: string;
        readonly snappyAt: any | null;
        readonly stepType: StepTypeEnum;
        readonly taggedElements: ReadonlyArray<{
          readonly alignment: ContextualTagAlignmentEnumType;
          readonly elementHtml: string | null;
          readonly elementSelector: string;
          readonly elementText: string | null;
          readonly entityId: any;
          readonly relativeToText: boolean;
          readonly style: {
            readonly color?: string | null;
            readonly opacity?: number | null;
            readonly padding?: number | null;
            readonly pulse?: boolean | null;
            readonly radius?: number | null;
            readonly text?: string | null;
            readonly thickness?: number | null;
            readonly type?: VisualTagHighlightType | null;
          } | null;
          readonly tooltipAlignment: ContextualTagTooltipAlignmentEnumType;
          readonly type: ContextualTagTypeEnumType;
          readonly url: string;
          readonly wildcardUrl: string;
          readonly xOffset: number;
          readonly yOffset: number;
        }>;
      }>;
      readonly templates: ReadonlyArray<{
        readonly entityId: any;
      }>;
    }>;
    readonly name: string | null;
    readonly notificationSettings: {
      readonly action: boolean | null;
      readonly branching: boolean | null;
      readonly disable: boolean | null;
      readonly info: boolean | null;
      readonly input: boolean | null;
    } | null;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly pageTargetingUrl: string | null;
    readonly priorityRanking: number;
    readonly privateName: string | null;
    readonly propagationCount: number;
    readonly propagationQueue: number;
    readonly splitSources: ReadonlyArray<{
      readonly entityId: any;
      readonly name: string | null;
    } | null>;
    readonly splitTargets: ReadonlyArray<{
      readonly name: string | null;
      readonly privateName: string | null;
    } | null>;
    readonly state: TemplateState;
    readonly stoppedAt: any | null;
    readonly taggedElements: ReadonlyArray<{
      readonly alignment: ContextualTagAlignmentEnumType;
      readonly elementHtml: string | null;
      readonly elementSelector: string;
      readonly elementText: string | null;
      readonly entityId: any;
      readonly relativeToText: boolean;
      readonly style: {
        readonly color?: string | null;
        readonly opacity?: number | null;
        readonly padding?: number | null;
        readonly pulse?: boolean | null;
        readonly radius?: number | null;
        readonly text?: string | null;
        readonly thickness?: number | null;
        readonly type?: VisualTagHighlightType | null;
      } | null;
      readonly tooltipAlignment: ContextualTagTooltipAlignmentEnumType;
      readonly type: ContextualTagTypeEnumType;
      readonly url: string;
      readonly wildcardUrl: string;
      readonly xOffset: number;
      readonly yOffset: number;
    }>;
    readonly targetingSet: any | null;
    readonly targets: {
      readonly account: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
      readonly accountUser: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
      readonly audiences: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      } | null;
    } | null;
    readonly theme: ThemeType;
    readonly type: GuideTypeEnumType;
    readonly " $fragmentSpreads": FragmentRefs<"TemplateOverflowMenuButton_template">;
  } | null;
};
export type EditTemplateQuery = {
  response: EditTemplateQuery$data;
  variables: EditTemplateQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTemplate",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "launchedAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stoppedAt",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isTargetedForSplitTesting",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationQueue",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propagationCount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topMargin",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rightMargin",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bottomMargin",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "leftMargin",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxWidth",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ruleType",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "valueType",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v32 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "attribute",
    "storageKey": null
  },
  (v29/*: any*/),
  (v30/*: any*/),
  (v31/*: any*/)
],
v33 = [
  (v11/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "InlineEmbedTargetingRule",
    "kind": "LinkedField",
    "name": "rules",
    "plural": true,
    "selections": (v32/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "grouping",
    "storageKey": null
  }
],
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "InlineEmbedTargeting",
  "kind": "LinkedField",
  "name": "targeting",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v33/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "InlineEmbedTargetingSegment",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v33/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v35 = [
  (v2/*: any*/)
],
v36 = {
  "alias": null,
  "args": null,
  "concreteType": "Template",
  "kind": "LinkedField",
  "name": "template",
  "plural": false,
  "selections": (v35/*: any*/),
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v41 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerPosition",
      "storageKey": null
    },
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v40/*: any*/)
  ],
  "type": "BannerStyle",
  "abstractKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v51 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "modalSize",
      "storageKey": null
    },
    (v20/*: any*/),
    (v42/*: any*/),
    (v39/*: any*/),
    (v37/*: any*/),
    (v38/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    (v45/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v40/*: any*/),
    (v48/*: any*/),
    (v49/*: any*/),
    (v50/*: any*/)
  ],
  "type": "ModalStyle",
  "abstractKey": null
},
v52 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundOverlayColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundOverlayOpacity",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasArrow",
      "storageKey": null
    },
    (v42/*: any*/),
    (v38/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tooltipShowOn",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tooltipSize",
      "storageKey": null
    },
    (v39/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    (v45/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v40/*: any*/),
    (v48/*: any*/),
    (v49/*: any*/),
    (v50/*: any*/)
  ],
  "type": "TooltipStyle",
  "abstractKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v54 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v56 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    (v45/*: any*/),
    (v46/*: any*/),
    (v47/*: any*/),
    (v53/*: any*/),
    (v48/*: any*/),
    (v54/*: any*/),
    (v25/*: any*/),
    (v24/*: any*/),
    (v55/*: any*/),
    (v40/*: any*/),
    (v49/*: any*/),
    (v50/*: any*/)
  ],
  "type": "CardStyle",
  "abstractKey": null
},
v57 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v43/*: any*/),
    (v44/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dotsColor",
      "storageKey": null
    },
    (v53/*: any*/),
    (v48/*: any*/),
    (v54/*: any*/),
    (v25/*: any*/),
    (v24/*: any*/),
    (v55/*: any*/),
    (v40/*: any*/)
  ],
  "type": "CarouselStyle",
  "abstractKey": null
},
v58 = {
  "kind": "InlineFragment",
  "selections": [
    (v37/*: any*/),
    (v38/*: any*/),
    (v39/*: any*/),
    (v54/*: any*/),
    (v25/*: any*/),
    (v24/*: any*/),
    (v55/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "selectedBackgroundColor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "statusLabelColor",
      "storageKey": null
    }
  ],
  "type": "VideoGalleryStyle",
  "abstractKey": null
},
v59 = {
  "kind": "InlineFragment",
  "selections": [
    (v43/*: any*/),
    (v44/*: any*/),
    (v53/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hideStepGroupTitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hideCompletedSteps",
      "storageKey": null
    },
    (v48/*: any*/),
    (v40/*: any*/)
  ],
  "type": "ChecklistStyle",
  "abstractKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSideQuest",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "archivedAt",
  "storageKey": null
},
v63 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expireBasedOn",
  "storageKey": null
},
v64 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expireAfter",
  "storageKey": null
},
v65 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v66 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingUrl",
  "storageKey": null
},
v67 = {
  "alias": null,
  "args": null,
  "concreteType": "TemplateNotificationSettings",
  "kind": "LinkedField",
  "name": "notificationSettings",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "disable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "branching",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "input",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "action",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "info",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v68 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "xOffset",
  "storageKey": null
},
v69 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "yOffset",
  "storageKey": null
},
v70 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "relativeToText",
  "storageKey": null
},
v71 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementText",
  "storageKey": null
},
v72 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementHtml",
  "storageKey": null
},
v73 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tooltipAlignment",
  "storageKey": null
},
v74 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v75 = {
  "kind": "InlineFragment",
  "selections": [
    (v11/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pulse",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "color",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "thickness",
      "storageKey": null
    },
    (v24/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "radius",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "opacity",
      "storageKey": null
    },
    (v74/*: any*/)
  ],
  "type": "VisualTagHighlightSettings",
  "abstractKey": null
},
v76 = [
  (v2/*: any*/),
  (v11/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/),
  (v27/*: any*/),
  (v68/*: any*/),
  (v69/*: any*/),
  (v70/*: any*/),
  (v19/*: any*/),
  (v71/*: any*/),
  (v72/*: any*/),
  (v73/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "style",
    "plural": false,
    "selections": [
      (v75/*: any*/)
    ],
    "storageKey": null
  }
],
v77 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTitle",
  "storageKey": null
},
v78 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "snappyAt",
  "storageKey": null
},
v79 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v80 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bodySlate",
  "storageKey": null
},
v81 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v82 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCompletionDisabled",
  "storageKey": null
},
v83 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "templateEntityId",
  "storageKey": null
},
v84 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "interactionType",
      "storageKey": null
    },
    (v83/*: any*/)
  ],
  "type": "OnGuideCompletion",
  "abstractKey": null
},
v85 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "eventName",
  "storageKey": null
},
v86 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completeForWholeAccount",
  "storageKey": null
},
v87 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "propertyName",
  "storageKey": null
},
v88 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberValue",
  "storageKey": null
},
v89 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textValue",
  "storageKey": null
},
v90 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v91 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateValue",
  "storageKey": null
},
v92 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingQuestion",
  "storageKey": null
},
v93 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingMultiple",
  "storageKey": null
},
v94 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingDismissDisabled",
  "storageKey": null
},
v95 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingFormFactor",
  "storageKey": null
},
v96 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "branchingKey",
  "storageKey": null
},
v97 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v98 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "choiceKey",
  "storageKey": null
},
v99 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundImageUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundImagePosition",
      "storageKey": null
    }
  ],
  "type": "BranchingCardStyle",
  "abstractKey": null
},
v100 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityType",
  "storageKey": null
},
v101 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "moduleEntityId",
  "storageKey": null
},
v102 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "style",
  "storageKey": null
},
v103 = {
  "alias": null,
  "args": null,
  "concreteType": "StepCtaSettingsType",
  "kind": "LinkedField",
  "name": "settings",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bgColorField",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "textColorField",
      "storageKey": null
    },
    (v85/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "markComplete",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "implicit",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "opensInNewTab",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v104 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "destinationGuide",
  "storageKey": null
},
v105 = [
  {
    "kind": "Variable",
    "name": "templateEntityId",
    "variableName": "templateEntityId"
  }
],
v106 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "naturalWidth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "naturalHeight",
      "storageKey": null
    }
  ],
  "type": "ImageMediaMeta",
  "abstractKey": null
},
v107 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "videoId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "videoType",
      "storageKey": null
    }
  ],
  "type": "VideoMediaMeta",
  "abstractKey": null
},
v108 = {
  "kind": "InlineFragment",
  "selections": [
    (v27/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fill",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hyperlink",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lightboxDisabled",
      "storageKey": null
    }
  ],
  "type": "ImageMediaReferenceSettings",
  "abstractKey": null
},
v109 = {
  "kind": "InlineFragment",
  "selections": [
    (v27/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "playsInline",
      "storageKey": null
    }
  ],
  "type": "VideoMediaReferenceSettings",
  "abstractKey": null
},
v110 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v111 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v112 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
},
v113 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "placeholder",
      "storageKey": null
    },
    (v110/*: any*/),
    (v111/*: any*/),
    (v112/*: any*/)
  ],
  "type": "TextOrEmailSettings",
  "abstractKey": null
},
v114 = {
  "kind": "InlineFragment",
  "selections": [
    (v110/*: any*/),
    (v111/*: any*/)
  ],
  "type": "NpsSettings",
  "abstractKey": null
},
v115 = {
  "kind": "InlineFragment",
  "selections": [
    (v110/*: any*/),
    (v111/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minLabel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxLabel",
      "storageKey": null
    },
    (v112/*: any*/)
  ],
  "type": "NumberPollSettings",
  "abstractKey": null
},
v116 = {
  "kind": "InlineFragment",
  "selections": [
    (v110/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "multiSelect",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "variation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DropdownInputOption",
      "kind": "LinkedField",
      "name": "options",
      "plural": true,
      "selections": [
        (v97/*: any*/),
        (v31/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "DropdownSettings",
  "abstractKey": null
},
v117 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAutoLaunchEnabled",
  "storageKey": null
},
v118 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enableAutoLaunchAt",
  "storageKey": null
},
v119 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "disableAutoLaunchAt",
  "storageKey": null
},
v120 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priorityRanking",
  "storageKey": null
},
v121 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasAutoLaunchedGuideBases",
  "storageKey": null
},
v122 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasGuideBases",
  "storageKey": null
},
v123 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "targetingSet",
  "storageKey": null
},
v124 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editedAt",
  "storageKey": null
},
v125 = [
  (v11/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "TargetGroupType",
    "kind": "LinkedField",
    "name": "groups",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetRuleType",
        "kind": "LinkedField",
        "name": "rules",
        "plural": true,
        "selections": (v32/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v126 = {
  "alias": null,
  "args": null,
  "concreteType": "TargetsType",
  "kind": "LinkedField",
  "name": "targets",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v125/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v125/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "audiences",
      "plural": false,
      "selections": (v125/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v127 = [
  {
    "kind": "Literal",
    "name": "autoLaunchableOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "category",
    "value": "all"
  }
],
v128 = [
  {
    "kind": "Literal",
    "name": "launched",
    "value": true
  }
],
v129 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startingType",
  "storageKey": null
},
v130 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v131 = [
  (v2/*: any*/),
  (v130/*: any*/)
],
v132 = {
  "alias": null,
  "args": null,
  "concreteType": "Template",
  "kind": "LinkedField",
  "name": "template",
  "plural": false,
  "selections": (v131/*: any*/),
  "storageKey": null
},
v133 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v134 = [
  (v2/*: any*/),
  (v11/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/),
  (v27/*: any*/),
  (v68/*: any*/),
  (v69/*: any*/),
  (v70/*: any*/),
  (v19/*: any*/),
  (v71/*: any*/),
  (v72/*: any*/),
  (v73/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "style",
    "plural": false,
    "selections": [
      (v133/*: any*/),
      {
        "kind": "TypeDiscriminator",
        "abstractKey": "__isVisualTagStyleSettings"
      },
      (v75/*: any*/)
    ],
    "storageKey": null
  },
  (v130/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditTemplateQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v34/*: any*/),
              (v7/*: any*/),
              (v36/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v41/*: any*/),
              (v51/*: any*/),
              (v52/*: any*/),
              (v56/*: any*/),
              (v57/*: any*/),
              (v58/*: any*/),
              (v59/*: any*/)
            ],
            "storageKey": null
          },
          (v60/*: any*/),
          (v61/*: any*/),
          (v62/*: any*/),
          (v63/*: any*/),
          (v64/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/),
          (v67/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": (v76/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v77/*: any*/),
              (v8/*: any*/),
              (v5/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v35/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v78/*: any*/),
                  (v79/*: any*/),
                  (v80/*: any*/),
                  (v81/*: any*/),
                  (v82/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "autoCompleteInteractions",
                    "plural": true,
                    "selections": [
                      (v84/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMapping",
                    "kind": "LinkedField",
                    "name": "eventMappings",
                    "plural": true,
                    "selections": [
                      (v85/*: any*/),
                      (v86/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMappingRule",
                        "kind": "LinkedField",
                        "name": "rules",
                        "plural": true,
                        "selections": [
                          (v87/*: any*/),
                          (v30/*: any*/),
                          (v29/*: any*/),
                          (v88/*: any*/),
                          (v89/*: any*/),
                          (v90/*: any*/),
                          (v91/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v92/*: any*/),
                  (v93/*: any*/),
                  (v94/*: any*/),
                  (v95/*: any*/),
                  (v96/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingChoice",
                    "kind": "LinkedField",
                    "name": "branchingChoices",
                    "plural": true,
                    "selections": [
                      (v97/*: any*/),
                      (v98/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v99/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v98/*: any*/),
                      (v100/*: any*/),
                      (v83/*: any*/),
                      (v36/*: any*/),
                      (v101/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Module",
                        "kind": "LinkedField",
                        "name": "module",
                        "plural": false,
                        "selections": (v35/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototypeCta",
                    "kind": "LinkedField",
                    "name": "ctas",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v11/*: any*/),
                      (v102/*: any*/),
                      (v74/*: any*/),
                      (v17/*: any*/),
                      (v103/*: any*/),
                      (v104/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v105/*: any*/),
                    "concreteType": "StepPrototypeTaggedElement",
                    "kind": "LinkedField",
                    "name": "taggedElements",
                    "plural": true,
                    "selections": (v76/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MediaReference",
                    "kind": "LinkedField",
                    "name": "mediaReferences",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v106/*: any*/),
                              (v107/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v108/*: any*/),
                          (v109/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototypeAutoCompleteInteraction",
                    "kind": "LinkedField",
                    "name": "autoCompleteInteraction",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v11/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v71/*: any*/),
                      (v72/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "InputStepPrototype",
                    "kind": "LinkedField",
                    "name": "inputs",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v97/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v113/*: any*/),
                          (v114/*: any*/),
                          (v115/*: any*/),
                          (v116/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v117/*: any*/),
          (v118/*: any*/),
          (v119/*: any*/),
          (v120/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitSources",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v121/*: any*/),
          (v122/*: any*/),
          (v123/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v124/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TemplateOverflowMenuButton_template"
          },
          (v126/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v127/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v9/*: any*/),
          (v11/*: any*/),
          (v120/*: any*/),
          (v117/*: any*/),
          (v16/*: any*/),
          (v61/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v77/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v128/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v129/*: any*/),
          (v120/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditTemplateQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationInlineEmbed",
            "kind": "LinkedField",
            "name": "inlineEmbed",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v34/*: any*/),
              (v7/*: any*/),
              (v132/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v133/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              (v41/*: any*/),
              (v51/*: any*/),
              (v52/*: any*/),
              (v56/*: any*/),
              (v57/*: any*/),
              (v58/*: any*/),
              (v59/*: any*/)
            ],
            "storageKey": null
          },
          (v60/*: any*/),
          (v61/*: any*/),
          (v62/*: any*/),
          (v63/*: any*/),
          (v64/*: any*/),
          (v65/*: any*/),
          (v66/*: any*/),
          (v67/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": (v134/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Module",
            "kind": "LinkedField",
            "name": "modules",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v77/*: any*/),
              (v8/*: any*/),
              (v5/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "templates",
                "plural": true,
                "selections": (v131/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "StepPrototype",
                "kind": "LinkedField",
                "name": "stepPrototypes",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v78/*: any*/),
                  (v79/*: any*/),
                  (v80/*: any*/),
                  (v81/*: any*/),
                  (v82/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "autoCompleteInteractions",
                    "plural": true,
                    "selections": [
                      (v133/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isAutoCompleteInteraction"
                      },
                      (v84/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepEventMapping",
                    "kind": "LinkedField",
                    "name": "eventMappings",
                    "plural": true,
                    "selections": [
                      (v85/*: any*/),
                      (v86/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepEventMappingRule",
                        "kind": "LinkedField",
                        "name": "rules",
                        "plural": true,
                        "selections": [
                          (v87/*: any*/),
                          (v30/*: any*/),
                          (v29/*: any*/),
                          (v88/*: any*/),
                          (v89/*: any*/),
                          (v90/*: any*/),
                          (v91/*: any*/),
                          (v130/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v92/*: any*/),
                  (v93/*: any*/),
                  (v94/*: any*/),
                  (v95/*: any*/),
                  (v96/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingChoice",
                    "kind": "LinkedField",
                    "name": "branchingChoices",
                    "plural": true,
                    "selections": [
                      (v97/*: any*/),
                      (v98/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v133/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isBranchingStyle"
                          },
                          (v99/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      (v98/*: any*/),
                      (v100/*: any*/),
                      (v83/*: any*/),
                      (v132/*: any*/),
                      (v101/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Module",
                        "kind": "LinkedField",
                        "name": "module",
                        "plural": false,
                        "selections": (v131/*: any*/),
                        "storageKey": null
                      },
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototypeCta",
                    "kind": "LinkedField",
                    "name": "ctas",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v11/*: any*/),
                      (v102/*: any*/),
                      (v74/*: any*/),
                      (v17/*: any*/),
                      (v103/*: any*/),
                      (v104/*: any*/),
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v105/*: any*/),
                    "concreteType": "StepPrototypeTaggedElement",
                    "kind": "LinkedField",
                    "name": "taggedElements",
                    "plural": true,
                    "selections": (v134/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MediaReference",
                    "kind": "LinkedField",
                    "name": "mediaReferences",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v133/*: any*/),
                              (v106/*: any*/),
                              (v107/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v130/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v133/*: any*/),
                          (v108/*: any*/),
                          (v109/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototypeAutoCompleteInteraction",
                    "kind": "LinkedField",
                    "name": "autoCompleteInteraction",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v11/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v71/*: any*/),
                      (v72/*: any*/),
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "InputStepPrototype",
                    "kind": "LinkedField",
                    "name": "inputs",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v97/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v133/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isInputSettings"
                          },
                          (v113/*: any*/),
                          (v114/*: any*/),
                          (v115/*: any*/),
                          (v116/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v130/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v130/*: any*/)
                ],
                "storageKey": null
              },
              (v130/*: any*/)
            ],
            "storageKey": null
          },
          (v117/*: any*/),
          (v118/*: any*/),
          (v119/*: any*/),
          (v120/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitSources",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v130/*: any*/)
            ],
            "storageKey": null
          },
          (v121/*: any*/),
          (v122/*: any*/),
          (v123/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v130/*: any*/)
            ],
            "storageKey": null
          },
          (v124/*: any*/),
          (v126/*: any*/),
          (v130/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "autoLaunchableTemplates",
        "args": (v127/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "templates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v9/*: any*/),
          (v11/*: any*/),
          (v120/*: any*/),
          (v117/*: any*/),
          (v16/*: any*/),
          (v61/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "splitTargets",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v77/*: any*/),
              (v130/*: any*/)
            ],
            "storageKey": null
          },
          (v130/*: any*/)
        ],
        "storageKey": "templates(autoLaunchableOnly:true,category:\"all\")"
      },
      {
        "alias": "launchedNpsSurveys",
        "args": (v128/*: any*/),
        "concreteType": "NpsSurvey",
        "kind": "LinkedField",
        "name": "npsSurveys",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v129/*: any*/),
          (v120/*: any*/),
          (v130/*: any*/)
        ],
        "storageKey": "npsSurveys(launched:true)"
      }
    ]
  },
  "params": {
    "cacheID": "aade4e3fb1c9f30dbdddf17b43d6220d",
    "id": null,
    "metadata": {},
    "name": "EditTemplateQuery",
    "operationKind": "query",
    "text": "query EditTemplateQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    entityId\n    name\n    privateName\n    isCyoa\n    isTemplate\n    state\n    description\n    launchedAt\n    stoppedAt\n    type\n    theme\n    isTargetedForSplitTesting\n    propagationQueue\n    propagationCount\n    formFactor\n    inlineEmbed {\n      entityId\n      url\n      wildcardUrl\n      elementSelector\n      position\n      topMargin\n      rightMargin\n      bottomMargin\n      padding\n      borderRadius\n      leftMargin\n      alignment\n      maxWidth\n      targeting {\n        account {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n        accountUser {\n          type\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n          grouping\n        }\n      }\n      state\n      template {\n        entityId\n        id\n      }\n    }\n    formFactorStyle {\n      __typename\n      __isFormFactorStyle: __typename\n      ... on BannerStyle {\n        bannerType\n        bannerPosition\n        backgroundColor\n        textColor\n        canDismiss\n        ctasOrientation\n      }\n      ... on ModalStyle {\n        modalSize\n        position\n        hasBackgroundOverlay\n        canDismiss\n        backgroundColor\n        textColor\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on TooltipStyle {\n        backgroundColor\n        backgroundOverlayColor\n        backgroundOverlayOpacity\n        hasArrow\n        hasBackgroundOverlay\n        textColor\n        tooltipShowOn\n        tooltipSize\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        ctasOrientation\n        imageWidth\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CardStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        verticalMediaOrientation\n        verticalMediaAlignment\n        horizontalMediaAlignment\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n        mediaFontSize\n        mediaTextColor\n      }\n      ... on CarouselStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        stepBodyOrientation\n        mediaOrientation\n        dotsColor\n        height\n        imageWidth\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        ctasOrientation\n      }\n      ... on VideoGalleryStyle {\n        backgroundColor\n        textColor\n        canDismiss\n        borderColor\n        borderRadius\n        padding\n        advancedPadding\n        selectedBackgroundColor\n        statusLabelColor\n      }\n      ... on ChecklistStyle {\n        stepBodyOrientation\n        mediaOrientation\n        height\n        hideStepGroupTitle\n        hideCompletedSteps\n        imageWidth\n        ctasOrientation\n      }\n    }\n    isSideQuest\n    designType\n    archivedAt\n    expireBasedOn\n    expireAfter\n    pageTargetingType\n    pageTargetingUrl\n    notificationSettings {\n      disable\n      branching\n      input\n      action\n      info\n    }\n    taggedElements {\n      entityId\n      type\n      url\n      wildcardUrl\n      alignment\n      xOffset\n      yOffset\n      relativeToText\n      elementSelector\n      elementText\n      elementHtml\n      tooltipAlignment\n      style {\n        __typename\n        __isVisualTagStyleSettings: __typename\n        ... on VisualTagHighlightSettings {\n          type\n          pulse\n          color\n          thickness\n          padding\n          radius\n          opacity\n          text\n        }\n      }\n      id\n    }\n    modules {\n      name\n      displayTitle\n      description\n      isCyoa\n      entityId\n      templates {\n        entityId\n        id\n      }\n      stepPrototypes {\n        name\n        entityId\n        snappyAt\n        body\n        bodySlate\n        stepType\n        manualCompletionDisabled\n        autoCompleteInteractions {\n          __typename\n          __isAutoCompleteInteraction: __typename\n          ... on OnGuideCompletion {\n            interactionType\n            templateEntityId\n          }\n        }\n        eventMappings {\n          eventName\n          completeForWholeAccount\n          rules {\n            propertyName\n            valueType\n            ruleType\n            numberValue\n            textValue\n            booleanValue\n            dateValue\n            id\n          }\n          id\n        }\n        branchingQuestion\n        branchingMultiple\n        branchingDismissDisabled\n        branchingFormFactor\n        branchingKey\n        branchingChoices {\n          label\n          choiceKey\n          style {\n            __typename\n            __isBranchingStyle: __typename\n            ... on BranchingCardStyle {\n              backgroundImageUrl\n              backgroundImagePosition\n            }\n          }\n        }\n        branchingPaths {\n          choiceKey\n          entityType\n          templateEntityId\n          template {\n            entityId\n            id\n          }\n          moduleEntityId\n          module {\n            entityId\n            id\n          }\n          id\n        }\n        ctas {\n          entityId\n          type\n          style\n          text\n          url\n          settings {\n            bgColorField\n            textColorField\n            eventName\n            markComplete\n            implicit\n            opensInNewTab\n          }\n          destinationGuide\n          id\n        }\n        taggedElements(templateEntityId: $templateEntityId) {\n          entityId\n          type\n          url\n          wildcardUrl\n          alignment\n          xOffset\n          yOffset\n          relativeToText\n          elementSelector\n          elementText\n          elementHtml\n          tooltipAlignment\n          style {\n            __typename\n            __isVisualTagStyleSettings: __typename\n            ... on VisualTagHighlightSettings {\n              type\n              pulse\n              color\n              thickness\n              padding\n              radius\n              opacity\n              text\n            }\n          }\n          id\n        }\n        mediaReferences {\n          entityId\n          media {\n            type\n            url\n            meta {\n              __typename\n              ... on ImageMediaMeta {\n                naturalWidth\n                naturalHeight\n              }\n              ... on VideoMediaMeta {\n                videoId\n                videoType\n              }\n            }\n            id\n          }\n          settings {\n            __typename\n            ... on ImageMediaReferenceSettings {\n              alignment\n              fill\n              hyperlink\n              lightboxDisabled\n            }\n            ... on VideoMediaReferenceSettings {\n              alignment\n              playsInline\n            }\n          }\n          id\n        }\n        autoCompleteInteraction {\n          url\n          type\n          wildcardUrl\n          elementSelector\n          elementText\n          elementHtml\n          id\n        }\n        inputs {\n          entityId\n          label\n          type\n          settings {\n            __typename\n            __isInputSettings: __typename\n            ... on TextOrEmailSettings {\n              placeholder\n              required\n              helperText\n              maxValue\n            }\n            ... on NpsSettings {\n              required\n              helperText\n            }\n            ... on NumberPollSettings {\n              required\n              helperText\n              minLabel\n              minValue\n              maxLabel\n              maxValue\n            }\n            ... on DropdownSettings {\n              required\n              multiSelect\n              variation\n              options {\n                label\n                value\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n      id\n    }\n    isAutoLaunchEnabled\n    enableAutoLaunchAt\n    disableAutoLaunchAt\n    priorityRanking\n    splitSources {\n      entityId\n      name\n      id\n    }\n    hasAutoLaunchedGuideBases\n    hasGuideBases\n    targetingSet\n    splitTargets {\n      name\n      privateName\n      id\n    }\n    editedAt\n    ...TemplateOverflowMenuButton_template\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      audiences {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    id\n  }\n  autoLaunchableTemplates: templates(autoLaunchableOnly: true, category: all) {\n    entityId\n    name\n    privateName\n    isCyoa\n    launchedAt\n    type\n    priorityRanking\n    isAutoLaunchEnabled\n    formFactor\n    designType\n    splitTargets {\n      entityId\n      name\n      privateName\n      displayTitle\n      id\n    }\n    id\n  }\n  launchedNpsSurveys: npsSurveys(launched: true) {\n    entityId\n    name\n    launchedAt\n    startingType\n    priorityRanking\n    id\n  }\n}\n\nfragment TemplateOverflowMenuButton_template on Template {\n  name\n  type\n  isCyoa\n  formFactor\n  designType\n  isSideQuest\n  privateName\n  entityId\n  isTargetedForSplitTesting\n  theme\n  isAutoLaunchEnabled\n  enableAutoLaunchAt\n  disableAutoLaunchAt\n  archivedAt\n  stoppedAt\n  isTemplate\n  hasGuideBases\n  splitTargets {\n    name\n    privateName\n    id\n  }\n  hasAutoLaunchedGuideBases\n  targets {\n    account {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    accountUser {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n    audiences {\n      type\n      groups {\n        rules {\n          attribute\n          ruleType\n          valueType\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "77bdc6f604581c1777c1bb46c1b455b1";

export default node;
