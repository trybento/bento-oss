/**
 * @generated SignedSource<<3b5707bce6d6882b7eabc7d9ab3463e3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ResetLevelEnumType = "account" | "guide_base" | "template";
export type GuideResetToastQuery$variables = {
  entityIds: ReadonlyArray<any>;
  resetLevel: ResetLevelEnumType;
};
export type GuideResetToastQuery$data = {
  readonly organization: {
    readonly areEntitiesResetting: boolean | null;
  };
};
export type GuideResetToastQuery = {
  response: GuideResetToastQuery$data;
  variables: GuideResetToastQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "entityIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resetLevel"
},
v2 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "entityIds",
      "variableName": "entityIds"
    },
    {
      "kind": "Variable",
      "name": "resetLevel",
      "variableName": "resetLevel"
    }
  ],
  "kind": "ScalarField",
  "name": "areEntitiesResetting",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GuideResetToastQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "GuideResetToastQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "728f65a67e562d59190f599752a148fb",
    "id": null,
    "metadata": {},
    "name": "GuideResetToastQuery",
    "operationKind": "query",
    "text": "query GuideResetToastQuery(\n  $resetLevel: ResetLevelEnumType!\n  $entityIds: [EntityId!]!\n) {\n  organization {\n    areEntitiesResetting(resetLevel: $resetLevel, entityIds: $entityIds)\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "92da228aca992e254ed9757b1f71a12f";

export default node;
