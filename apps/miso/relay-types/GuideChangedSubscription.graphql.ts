/**
 * @generated SignedSource<<57f9a3554848eac2dbf7346c680c32fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GuideChangedSubscription$variables = {
  guideEntityId: any;
};
export type GuideChangedSubscription$data = {
  readonly guide: {
    readonly " $fragmentSpreads": FragmentRefs<"GuideChanged_guide">;
  } | null;
};
export type GuideChangedSubscription = {
  response: GuideChangedSubscription$data;
  variables: GuideChangedSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "guideEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "guideEntityId",
    "variableName": "guideEntityId"
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
  "name": "id",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v7 = [
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
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GuideChangedSubscription",
    "selections": [
      {
        "alias": "guide",
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "guideChanged",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "GuideChanged_guide"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GuideChangedSubscription",
    "selections": [
      {
        "alias": "guide",
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "guideChanged",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "attributes",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "primaryContact",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideModule",
            "kind": "LinkedField",
            "name": "guideModules",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "createdFromModule",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Step",
                "kind": "LinkedField",
                "name": "steps",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "body",
                    "storageKey": null
                  },
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "completedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "completedByType",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "stepType",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "usersViewed",
                    "plural": true,
                    "selections": (v7/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "completedByUser",
                    "plural": false,
                    "selections": (v7/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "completedByAccountUser",
                    "plural": false,
                    "selections": (v7/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bodySlate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isAutoCompletable",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "createdFromStepPrototype",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d502fef4b166cfcf01092de3b77b05ce",
    "id": null,
    "metadata": {},
    "name": "GuideChangedSubscription",
    "operationKind": "subscription",
    "text": "subscription GuideChangedSubscription(\n  $guideEntityId: EntityId!\n) {\n  guide: guideChanged(guideEntityId: $guideEntityId) {\n    ...GuideChanged_guide\n    id\n  }\n}\n\nfragment GuideChanged_guide on Guide {\n  entityId\n  name\n  state\n  type\n  createdFromTemplate {\n    entityId\n    name\n    id\n  }\n  account {\n    entityId\n    name\n    attributes\n    primaryContact {\n      entityId\n      id\n    }\n    id\n  }\n  guideModules {\n    name\n    entityId\n    orderIndex\n    createdFromModule {\n      entityId\n      id\n    }\n    steps {\n      name\n      entityId\n      body\n      orderIndex\n      completedAt\n      completedByType\n      stepType\n      usersViewed {\n        fullName\n        email\n        id\n      }\n      completedByUser {\n        fullName\n        email\n        id\n      }\n      completedByAccountUser {\n        fullName\n        email\n        id\n      }\n      bodySlate\n      isAutoCompletable\n      createdFromStepPrototype {\n        entityId\n        id\n      }\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3edb65d1baeda306804b6086f2dc1b65";

export default node;
