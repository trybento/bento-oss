/**
 * @generated SignedSource<<c57c192d2b7b0051bf4d7d89727e93e0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type InlineEmbedAlignment = "center" | "left" | "right";
export type InlineEmbedPosition = "after" | "before" | "inside";
export type InlineEmbedState = "active" | "inactive";
export type InlineEmbedTargetingType = "all" | "attribute_rules" | "role";
export type TargetAttributeRuleRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
import { FragmentRefs } from "relay-runtime";
export type LibraryTemplates_query$data = {
  readonly templatesConnection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly archivedAt: any | null;
        readonly designType: GuideDesignTypeEnumType;
        readonly disableAutoLaunchAt: any | null;
        readonly editedAt: any | null;
        readonly editedBy: {
          readonly email: string;
          readonly fullName: string | null;
        } | null;
        readonly enableAutoLaunchAt: any | null;
        readonly entityId: any;
        readonly formFactor: GuideFormFactorEnumType | null;
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
        readonly isTemplate: boolean;
        readonly lastUsedAt: any | null;
        readonly modules: ReadonlyArray<{
          readonly description: string | null;
          readonly displayTitle: string | null;
          readonly entityId: any;
          readonly hasBranchingStep: boolean | null;
          readonly hasInputStep: boolean | null;
          readonly name: string | null;
        }>;
        readonly name: string | null;
        readonly pageTargetingType: GuidePageTargetingEnumType;
        readonly pageTargetingUrl: string | null;
        readonly priorityRanking: number;
        readonly privateName: string | null;
        readonly state: TemplateState;
        readonly stepsCount: number;
        readonly taggedElements: ReadonlyArray<{
          readonly entityId: any;
          readonly url: string;
          readonly wildcardUrl: string;
        }>;
        readonly theme: ThemeType;
        readonly type: GuideTypeEnumType;
        readonly warnUnpublishedTag: boolean;
      };
    } | null> | null;
  } | null;
  readonly " $fragmentType": "LibraryTemplates_query";
};
export type LibraryTemplates_query$key = {
  readonly " $data"?: LibraryTemplates_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"LibraryTemplates_query">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "templatesConnection"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v7 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "InlineEmbedTargetingRule",
    "kind": "LinkedField",
    "name": "rules",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "attribute",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "ruleType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "valueType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "value",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "grouping",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "audienceEntityId"
    },
    {
      "kind": "RootArgument",
      "name": "before"
    },
    {
      "kind": "RootArgument",
      "name": "filters"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "last"
    },
    {
      "kind": "RootArgument",
      "name": "orderBy"
    },
    {
      "kind": "RootArgument",
      "name": "orderDirection"
    },
    {
      "kind": "RootArgument",
      "name": "search"
    },
    {
      "kind": "RootArgument",
      "name": "userEmail"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "bidirectional",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": {
          "count": "last",
          "cursor": "before"
        },
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": require('./LibraryTemplatesPaginationQuery.graphql')
    }
  },
  "name": "LibraryTemplates_query",
  "selections": [
    {
      "alias": "templatesConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "audienceEntityId",
          "variableName": "audienceEntityId"
        },
        {
          "kind": "Variable",
          "name": "filters",
          "variableName": "filters"
        },
        {
          "kind": "Variable",
          "name": "orderBy",
          "variableName": "orderBy"
        },
        {
          "kind": "Variable",
          "name": "orderDirection",
          "variableName": "orderDirection"
        },
        {
          "kind": "Variable",
          "name": "search",
          "variableName": "search"
        },
        {
          "kind": "Variable",
          "name": "userEmail",
          "variableName": "userEmail"
        }
      ],
      "concreteType": "TemplatesConnectionConnection",
      "kind": "LinkedField",
      "name": "__LibraryTemplates_templatesConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TemplatesConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Template",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                (v2/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "privateName",
                  "storageKey": null
                },
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isCyoa",
                  "storageKey": null
                },
                (v4/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "theme",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isAutoLaunchEnabled",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "archivedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "stepsCount",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "pageTargetingType",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "pageTargetingUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "formFactor",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "designType",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "priorityRanking",
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
                    (v1/*: any*/),
                    (v2/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "description",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "displayTitle",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "hasBranchingStep",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "hasInputStep",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "isTemplate",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "lastUsedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "warnUnpublishedTag",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "OrganizationInlineEmbed",
                  "kind": "LinkedField",
                  "name": "inlineEmbed",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    (v5/*: any*/),
                    (v6/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "elementSelector",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "position",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "topMargin",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "rightMargin",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "bottomMargin",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "padding",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "borderRadius",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "leftMargin",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "alignment",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "maxWidth",
                      "storageKey": null
                    },
                    {
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
                          "selections": (v7/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "InlineEmbedTargetingSegment",
                          "kind": "LinkedField",
                          "name": "accountUser",
                          "plural": false,
                          "selections": (v7/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    (v4/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Template",
                      "kind": "LinkedField",
                      "name": "template",
                      "plural": false,
                      "selections": [
                        (v1/*: any*/)
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "checkFirstStepSupport",
                      "value": true
                    }
                  ],
                  "concreteType": "StepPrototypeTaggedElement",
                  "kind": "LinkedField",
                  "name": "taggedElements",
                  "plural": true,
                  "selections": [
                    (v1/*: any*/),
                    (v5/*: any*/),
                    (v6/*: any*/)
                  ],
                  "storageKey": "taggedElements(checkFirstStepSupport:true)"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "disableAutoLaunchAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "enableAutoLaunchAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "editedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "User",
                  "kind": "LinkedField",
                  "name": "editedBy",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "fullName",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "email",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasPreviousPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "startCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "RootType",
  "abstractKey": null
};
})();

(node as any).hash = "28f9d4e5176581b287bbd4b6bff5dd96";

export default node;
