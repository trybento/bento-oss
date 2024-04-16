/**
 * @generated SignedSource<<6697998fa23bbaf6ddd6075a31297b3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteTemplatesInput = {
  templateEntityIds?: ReadonlyArray<any> | null;
};
export type DeleteTemplatesMutation$variables = {
  input: DeleteTemplatesInput;
};
export type DeleteTemplatesMutation$data = {
  readonly deleteTemplates: {
    readonly deletedTemplateIds: ReadonlyArray<string | null> | null;
    readonly errors: ReadonlyArray<string> | null;
  } | null;
};
export type DeleteTemplatesMutation = {
  response: DeleteTemplatesMutation$data;
  variables: DeleteTemplatesMutation$variables;
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
    "concreteType": "DeleteTemplatesPayload",
    "kind": "LinkedField",
    "name": "deleteTemplates",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedTemplateIds",
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
    "name": "DeleteTemplatesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteTemplatesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e98559c7e491872dd35e448f736b605c",
    "id": null,
    "metadata": {},
    "name": "DeleteTemplatesMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteTemplatesMutation(\n  $input: DeleteTemplatesInput!\n) {\n  deleteTemplates(input: $input) {\n    deletedTemplateIds\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "db24d1428cead5bb39fd6c9870fbc946";

export default node;
