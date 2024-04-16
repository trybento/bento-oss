/**
 * @generated SignedSource<<debd246a748ccb2d5b642a9661ea40d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteGuideBaseInput = {
  guideBaseEntityId: any;
};
export type DeleteGuideBaseMutation$variables = {
  input: DeleteGuideBaseInput;
  templateEntityId?: any | null;
};
export type DeleteGuideBaseMutation$data = {
  readonly deleteGuideBase: {
    readonly account: {
      readonly hasGuideBaseWithTemplate: boolean;
    } | null;
    readonly deletedGuideBaseId: string | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteGuideBaseMutation = {
  response: DeleteGuideBaseMutation$data;
  variables: DeleteGuideBaseMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedGuideBaseId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "templateEntityId",
      "variableName": "templateEntityId"
    }
  ],
  "kind": "ScalarField",
  "name": "hasGuideBaseWithTemplate",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "errors",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGuideBasePayload",
        "kind": "LinkedField",
        "name": "deleteGuideBase",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGuideBasePayload",
        "kind": "LinkedField",
        "name": "deleteGuideBase",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
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
    "cacheID": "5803d606c17ffbdaba4477d4edbcee8f",
    "id": null,
    "metadata": {},
    "name": "DeleteGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteGuideBaseMutation(\n  $input: DeleteGuideBaseInput!\n  $templateEntityId: EntityId\n) {\n  deleteGuideBase(input: $input) {\n    deletedGuideBaseId\n    account {\n      hasGuideBaseWithTemplate(templateEntityId: $templateEntityId)\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "b8c34b4c15f4482d198c89ace24b0ee9";

export default node;
