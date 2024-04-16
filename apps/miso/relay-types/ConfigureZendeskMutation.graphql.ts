/**
 * @generated SignedSource<<8cf5dd35d8edffa96107e66393076f5b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ConfigureZendeskInput = {
  subdomain?: string | null;
  username?: string | null;
};
export type ConfigureZendeskMutation$variables = {
  input: ConfigureZendeskInput;
};
export type ConfigureZendeskMutation$data = {
  readonly configureZendesk: {
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type ConfigureZendeskMutation = {
  response: ConfigureZendeskMutation$data;
  variables: ConfigureZendeskMutation$variables;
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
    "concreteType": "ConfigureZendeskPayload",
    "kind": "LinkedField",
    "name": "configureZendesk",
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
    "name": "ConfigureZendeskMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ConfigureZendeskMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a1aceaacf484c2bb0ba4267f454acd40",
    "id": null,
    "metadata": {},
    "name": "ConfigureZendeskMutation",
    "operationKind": "mutation",
    "text": "mutation ConfigureZendeskMutation(\n  $input: ConfigureZendeskInput!\n) {\n  configureZendesk(input: $input) {\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "a212cd3ea6f7537f37ebd1332008614c";

export default node;
