/**
 * @generated SignedSource<<79d735e29807769185a954b61adda8c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InlineEmbedState = "active" | "inactive";
export type OrderDirection = "asc" | "desc";
export type TemplatesOrderBy = "editedAt" | "editedBy" | "lastUsedAt" | "name" | "priorityRanking" | "scope" | "state";
export type LibraryTemplatesQuery$variables = {
  after?: string | null;
  audienceEntityId?: string | null;
  before?: string | null;
  filters?: any | null;
  first?: number | null;
  last?: number | null;
  orderBy?: TemplatesOrderBy | null;
  orderDirection?: OrderDirection | null;
  search?: string | null;
  userEmail?: string | null;
};
export type LibraryTemplatesQuery$data = {
  readonly orgInlineEmbeds: ReadonlyArray<{
    readonly elementSelector: string;
    readonly entityId: any;
    readonly state: InlineEmbedState;
    readonly url: string;
    readonly wildcardUrl: string;
  } | null> | null;
  readonly " $fragmentSpreads": FragmentRefs<"LibraryTemplates_query">;
};
export type LibraryTemplatesQuery = {
  response: LibraryTemplatesQuery$data;
  variables: LibraryTemplatesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "audienceEntityId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filters"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderBy"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderDirection"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "search"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userEmail"
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v15 = {
  "alias": "orgInlineEmbeds",
  "args": null,
  "concreteType": "OrganizationInlineEmbed",
  "kind": "LinkedField",
  "name": "inlineEmbeds",
  "plural": true,
  "selections": [
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v13/*: any*/),
    (v14/*: any*/)
  ],
  "storageKey": null
},
v16 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "audienceEntityId",
    "variableName": "audienceEntityId"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
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
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v20 = [
  (v18/*: any*/),
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
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "LibraryTemplatesQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "LibraryTemplates_query"
      },
      (v15/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v0/*: any*/),
      (v5/*: any*/),
      (v2/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v1/*: any*/),
      (v9/*: any*/),
      (v3/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "LibraryTemplatesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v16/*: any*/),
        "concreteType": "TemplatesConnectionConnection",
        "kind": "LinkedField",
        "name": "templatesConnection",
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
                  (v10/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "privateName",
                    "storageKey": null
                  },
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isCyoa",
                    "storageKey": null
                  },
                  (v13/*: any*/),
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
                      (v10/*: any*/),
                      (v17/*: any*/),
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
                      },
                      (v19/*: any*/)
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
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v14/*: any*/),
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
                            "selections": (v20/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "InlineEmbedTargetingSegment",
                            "kind": "LinkedField",
                            "name": "accountUser",
                            "plural": false,
                            "selections": (v20/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Template",
                        "kind": "LinkedField",
                        "name": "template",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v19/*: any*/)
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
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v19/*: any*/)
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
                      },
                      (v19/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v19/*: any*/),
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
      },
      {
        "alias": null,
        "args": (v16/*: any*/),
        "filters": [
          "orderBy",
          "orderDirection",
          "audienceEntityId",
          "userEmail",
          "filters",
          "search"
        ],
        "handle": "connection",
        "key": "LibraryTemplates_templatesConnection",
        "kind": "LinkedHandle",
        "name": "templatesConnection"
      },
      (v15/*: any*/)
    ]
  },
  "params": {
    "cacheID": "912a0fe538f16a5402d439889b1ed64b",
    "id": null,
    "metadata": {},
    "name": "LibraryTemplatesQuery",
    "operationKind": "query",
    "text": "query LibraryTemplatesQuery(\n  $first: Int\n  $after: String\n  $last: Int\n  $before: String\n  $orderBy: TemplatesOrderBy\n  $orderDirection: OrderDirection\n  $audienceEntityId: String\n  $userEmail: String\n  $filters: JSON\n  $search: String\n) {\n  ...LibraryTemplates_query\n  orgInlineEmbeds: inlineEmbeds {\n    entityId\n    url\n    wildcardUrl\n    state\n    elementSelector\n  }\n}\n\nfragment LibraryTemplates_query on RootType {\n  templatesConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection, audienceEntityId: $audienceEntityId, userEmail: $userEmail, filters: $filters, search: $search) {\n    edges {\n      node {\n        entityId\n        name\n        privateName\n        type\n        isCyoa\n        state\n        theme\n        isAutoLaunchEnabled\n        archivedAt\n        stepsCount\n        pageTargetingType\n        pageTargetingUrl\n        formFactor\n        designType\n        priorityRanking\n        modules {\n          entityId\n          name\n          description\n          displayTitle\n          hasBranchingStep\n          hasInputStep\n          id\n        }\n        isTemplate\n        lastUsedAt\n        warnUnpublishedTag\n        inlineEmbed {\n          entityId\n          url\n          wildcardUrl\n          elementSelector\n          position\n          topMargin\n          rightMargin\n          bottomMargin\n          padding\n          borderRadius\n          leftMargin\n          alignment\n          maxWidth\n          targeting {\n            account {\n              type\n              rules {\n                attribute\n                ruleType\n                valueType\n                value\n              }\n              grouping\n            }\n            accountUser {\n              type\n              rules {\n                attribute\n                ruleType\n                valueType\n                value\n              }\n              grouping\n            }\n          }\n          state\n          template {\n            entityId\n            id\n          }\n        }\n        taggedElements(checkFirstStepSupport: true) {\n          entityId\n          url\n          wildcardUrl\n          id\n        }\n        disableAutoLaunchAt\n        enableAutoLaunchAt\n        editedAt\n        editedBy {\n          fullName\n          email\n          id\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7cb01cd1374c2fe4f8ec1e63d5f0752b";

export default node;
