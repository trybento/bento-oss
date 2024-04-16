/**
 * @generated SignedSource<<31e58de8ab48fd22686b49a1aaa101ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ArrayToCsvReportInput = {
  data: ReadonlyArray<any>;
  filename: string;
  html?: string | null;
  subject: string;
  text?: string | null;
};
export type ArrayToCsvReportMutation$variables = {
  input: ArrayToCsvReportInput;
};
export type ArrayToCsvReportMutation$data = {
  readonly arrayToCsvReport: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ArrayToCsvReportMutation = {
  response: ArrayToCsvReportMutation$data;
  variables: ArrayToCsvReportMutation$variables;
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
    "concreteType": "ArrayToCsvReportPayload",
    "kind": "LinkedField",
    "name": "arrayToCsvReport",
    "plural": false,
    "selections": [
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
    "name": "ArrayToCsvReportMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArrayToCsvReportMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1dd32d5a87b9505309e7c2018f594baf",
    "id": null,
    "metadata": {},
    "name": "ArrayToCsvReportMutation",
    "operationKind": "mutation",
    "text": "mutation ArrayToCsvReportMutation(\n  $input: ArrayToCsvReportInput!\n) {\n  arrayToCsvReport(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "ac28f086405bca81f178c7e451691a17";

export default node;
