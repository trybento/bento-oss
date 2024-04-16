/**
 * @generated SignedSource<<3baff0ecea00f3f30dd188cf2de9d865>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountUserEmailLookupQuery$variables = {
  accountUserEmail: string;
};
export type AccountUserEmailLookupQuery$data = {
  readonly accountUser: {
    readonly account: {
      readonly externalId: string | null;
      readonly name: string;
    };
    readonly attributes: any;
    readonly email: string | null;
    readonly externalId: string | null;
    readonly fullName: string | null;
  } | null;
};
export type AccountUserEmailLookupQuery = {
  response: AccountUserEmailLookupQuery$data;
  variables: AccountUserEmailLookupQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountUserEmail"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "accountUserEmail"
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
  "name": "email",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "attributes",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalId",
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountUserEmailLookupQuery",
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
              (v5/*: any*/)
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
    "name": "AccountUserEmailLookupQuery",
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
              (v5/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9d158d57490e3ea4714ec505c77ac6bd",
    "id": null,
    "metadata": {},
    "name": "AccountUserEmailLookupQuery",
    "operationKind": "query",
    "text": "query AccountUserEmailLookupQuery(\n  $accountUserEmail: String!\n) {\n  accountUser: findAccountUser(email: $accountUserEmail) {\n    fullName\n    email\n    attributes\n    externalId\n    account {\n      name\n      externalId\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "06d6bbf08ffc14c08f565bcf6bb4e367";

export default node;
