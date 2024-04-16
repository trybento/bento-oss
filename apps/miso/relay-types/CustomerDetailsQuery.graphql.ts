/**
 * @generated SignedSource<<17e287ab8750fc22acd5e855f3e99007>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeType = "account" | "account_user";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type CustomerDetailsQuery$variables = {
  accountEntityId: any;
};
export type CustomerDetailsQuery$data = {
  readonly account: {
    readonly attributes: any;
  } | null;
  readonly attributes: ReadonlyArray<{
    readonly name: string;
    readonly type: AttributeType | null;
    readonly valueType: AttributeValueType;
  }>;
};
export type CustomerDetailsQuery = {
  response: CustomerDetailsQuery$data;
  variables: CustomerDetailsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "accountEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "attributes",
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
  "name": "valueType",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
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
    "name": "CustomerDetailsQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
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
    "name": "CustomerDetailsQuery",
    "selections": [
      {
        "alias": "account",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "findAccount",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2c29c8d002d52e7ed4444959614b7654",
    "id": null,
    "metadata": {},
    "name": "CustomerDetailsQuery",
    "operationKind": "query",
    "text": "query CustomerDetailsQuery(\n  $accountEntityId: EntityId!\n) {\n  account: findAccount(entityId: $accountEntityId) {\n    attributes\n    id\n  }\n  attributes {\n    name\n    valueType\n    type\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "0860d7c849fceb4849fcefda4f8c69f6";

export default node;
