/**
 * @generated SignedSource<<2cee41da4562356ef33ce99521f73c17>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrderDirection = "asc" | "desc";
export type TemplatesOrderBy = "editedAt" | "editedBy" | "lastUsedAt" | "name" | "priorityRanking" | "scope" | "state";
export type LibraryTemplatesPaginationQuery$variables = {
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
export type LibraryTemplatesPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"LibraryTemplates_query">;
};
export type LibraryTemplatesPaginationQuery = {
  response: LibraryTemplatesPaginationQuery$data;
  variables: LibraryTemplatesPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "audienceEntityId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "before"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "last"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderDirection"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "search"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userEmail"
  }
],
v1 = [
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
  "name": "type",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wildcardUrl",
  "storageKey": null
},
v9 = [
  (v4/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LibraryTemplatesPaginationQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "LibraryTemplates_query"
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LibraryTemplatesPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "privateName",
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isCyoa",
                    "storageKey": null
                  },
                  (v5/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                      (v6/*: any*/)
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
                      (v2/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
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
                            "selections": (v9/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "InlineEmbedTargetingSegment",
                            "kind": "LinkedField",
                            "name": "accountUser",
                            "plural": false,
                            "selections": (v9/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Template",
                        "kind": "LinkedField",
                        "name": "template",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v6/*: any*/)
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
                      (v2/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
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
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/),
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
        "args": (v1/*: any*/),
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
      }
    ]
  },
  "params": {
    "cacheID": "426d43150e57cba6161cfdc6e1221736",
    "id": null,
    "metadata": {},
    "name": "LibraryTemplatesPaginationQuery",
    "operationKind": "query",
    "text": "query LibraryTemplatesPaginationQuery(\n  $after: String\n  $audienceEntityId: String\n  $before: String\n  $filters: JSON\n  $first: Int\n  $last: Int\n  $orderBy: TemplatesOrderBy\n  $orderDirection: OrderDirection\n  $search: String\n  $userEmail: String\n) {\n  ...LibraryTemplates_query\n}\n\nfragment LibraryTemplates_query on RootType {\n  templatesConnection(first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy, orderDirection: $orderDirection, audienceEntityId: $audienceEntityId, userEmail: $userEmail, filters: $filters, search: $search) {\n    edges {\n      node {\n        entityId\n        name\n        privateName\n        type\n        isCyoa\n        state\n        theme\n        isAutoLaunchEnabled\n        archivedAt\n        stepsCount\n        pageTargetingType\n        pageTargetingUrl\n        formFactor\n        designType\n        priorityRanking\n        modules {\n          entityId\n          name\n          description\n          displayTitle\n          hasBranchingStep\n          hasInputStep\n          id\n        }\n        isTemplate\n        lastUsedAt\n        warnUnpublishedTag\n        inlineEmbed {\n          entityId\n          url\n          wildcardUrl\n          elementSelector\n          position\n          topMargin\n          rightMargin\n          bottomMargin\n          padding\n          borderRadius\n          leftMargin\n          alignment\n          maxWidth\n          targeting {\n            account {\n              type\n              rules {\n                attribute\n                ruleType\n                valueType\n                value\n              }\n              grouping\n            }\n            accountUser {\n              type\n              rules {\n                attribute\n                ruleType\n                valueType\n                value\n              }\n              grouping\n            }\n          }\n          state\n          template {\n            entityId\n            id\n          }\n        }\n        taggedElements(checkFirstStepSupport: true) {\n          entityId\n          url\n          wildcardUrl\n          id\n        }\n        disableAutoLaunchAt\n        enableAutoLaunchAt\n        editedAt\n        editedBy {\n          fullName\n          email\n          id\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "28f9d4e5176581b287bbd4b6bff5dd96";

export default node;
