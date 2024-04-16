/**
 * @generated SignedSource<<03b975b7949961373a63f155751dc8e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideState = "active" | "draft" | "expired" | "inactive";
export type AccountUserQuery$variables = {
  entityId: any;
};
export type AccountUserQuery$data = {
  readonly accountUser: {
    readonly account: {
      readonly attributes: any;
      readonly entityId: any;
      readonly name: string;
    };
    readonly attributes: any;
    readonly entityId: any;
    readonly externalId: string | null;
    readonly fullName: string | null;
  } | null;
  readonly guides: ReadonlyArray<{
    readonly completedAt: any | null;
    readonly completionPercentage: number;
    readonly createdFromGuideBase: {
      readonly entityId: any;
      readonly wasAutoLaunched: boolean;
    } | null;
    readonly createdFromTemplate: {
      readonly entityId: any;
      readonly name: string | null;
      readonly privateName: string | null;
    } | null;
    readonly designType: GuideDesignTypeEnumType;
    readonly entityId: any;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly isCyoa: boolean | null;
    readonly isSideQuest: boolean | null;
    readonly lastActiveAt: any | null;
    readonly name: string;
    readonly state: GuideState;
  } | null>;
};
export type AccountUserQuery = {
  response: AccountUserQuery$data;
  variables: AccountUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "attributes",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "name": "isSideQuest",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastActiveAt",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completionPercentage",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "wasAutoLaunched",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountUserQuery",
    "selections": [
      {
        "alias": "accountUser",
        "args": (v1/*: any*/),
        "concreteType": "AccountUser",
        "kind": "LinkedField",
        "name": "findAccountUser",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "guides",
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "findGuidesForUser",
        "plural": true,
        "selections": [
          (v3/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "createdFromGuideBase",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v3/*: any*/)
            ],
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
              (v3/*: any*/),
              (v6/*: any*/),
              (v16/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AccountUserQuery",
    "selections": [
      {
        "alias": "accountUser",
        "args": (v1/*: any*/),
        "concreteType": "AccountUser",
        "kind": "LinkedField",
        "name": "findAccountUser",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/),
              (v17/*: any*/)
            ],
            "storageKey": null
          },
          (v17/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "guides",
        "args": (v1/*: any*/),
        "concreteType": "Guide",
        "kind": "LinkedField",
        "name": "findGuidesForUser",
        "plural": true,
        "selections": [
          (v3/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "createdFromGuideBase",
            "plural": false,
            "selections": [
              (v15/*: any*/),
              (v3/*: any*/),
              (v17/*: any*/)
            ],
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
              (v3/*: any*/),
              (v6/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/)
            ],
            "storageKey": null
          },
          (v17/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e7b429ed705741ad9b939d474c9dc95a",
    "id": null,
    "metadata": {},
    "name": "AccountUserQuery",
    "operationKind": "query",
    "text": "query AccountUserQuery(\n  $entityId: EntityId!\n) {\n  accountUser: findAccountUser(entityId: $entityId) {\n    fullName\n    entityId\n    externalId\n    attributes\n    account {\n      name\n      entityId\n      attributes\n      id\n    }\n    id\n  }\n  guides: findGuidesForUser(entityId: $entityId) {\n    entityId\n    name\n    state\n    isSideQuest\n    formFactor\n    isCyoa\n    designType\n    lastActiveAt\n    completedAt\n    completionPercentage\n    createdFromGuideBase {\n      wasAutoLaunched\n      entityId\n      id\n    }\n    createdFromTemplate {\n      entityId\n      name\n      privateName\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0ea1f305d6bab5fd6521ff8fa579472a";

export default node;
