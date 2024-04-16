/**
 * @generated SignedSource<<35a773cb2453f35ed086e0913abc3653>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteOrganizationInlineEmbedInput = {
  entityId: any;
};
export type DeleteInlineEmbedMutation$variables = {
  input: DeleteOrganizationInlineEmbedInput;
};
export type DeleteInlineEmbedMutation$data = {
  readonly deleteInlineEmbed: {
    readonly inlineEmbedEntityId: any | null;
  } | null;
};
export type DeleteInlineEmbedMutation = {
  response: DeleteInlineEmbedMutation$data;
  variables: DeleteInlineEmbedMutation$variables;
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
    "concreteType": "DeleteOrganizationInlineEmbedPayload",
    "kind": "LinkedField",
    "name": "deleteInlineEmbed",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "inlineEmbedEntityId",
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
    "name": "DeleteInlineEmbedMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteInlineEmbedMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "44e010c2cf41304933198cfb8b21c115",
    "id": null,
    "metadata": {},
    "name": "DeleteInlineEmbedMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteInlineEmbedMutation(\n  $input: DeleteOrganizationInlineEmbedInput!\n) {\n  deleteInlineEmbed(input: $input) {\n    inlineEmbedEntityId\n  }\n}\n"
  }
};
})();

(node as any).hash = "bae8badfd62106e9a9f0c7612387063c";

export default node;
