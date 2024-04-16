/**
 * @generated SignedSource<<867e074dfafa62bb2dd4391f3ca65b5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type QARequestInput = {
  param?: string | null;
  paramTwo?: string | null;
  request: string;
};
export type QARequestMutation$variables = {
  input: QARequestInput;
};
export type QARequestMutation$data = {
  readonly qaRequest: {
    readonly errors: ReadonlyArray<string> | null;
    readonly jsonString: string | null;
    readonly result: string;
  } | null;
};
export type QARequestMutation = {
  response: QARequestMutation$data;
  variables: QARequestMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "QARequestPayload",
    "kind": "LinkedField",
    "name": "qaRequest",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "result",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "jsonString",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "errors",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "QARequestMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "QARequestMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6e020fda5992fa10898b3bb9211e9e2d",
    "id": null,
    "metadata": {},
    "name": "QARequestMutation",
    "operationKind": "mutation",
    "text": "mutation QARequestMutation(\n  $input: QARequestInput!\n) {\n  qaRequest(input: $input) {\n    result\n    jsonString\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d34ac570542181f56f47bd2261aafdb";

export default node;
