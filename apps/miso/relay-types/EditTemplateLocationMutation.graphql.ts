/**
 * @generated SignedSource<<d16eafc140f323774d5b9a3527289d1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type EditTemplateLocationInput = {
  entityId: any;
  inlineEmbedEntityId?: any | null;
  url: string;
  wildcardUrl: string;
};
export type EditTemplateLocationMutation$variables = {
  input: EditTemplateLocationInput;
};
export type EditTemplateLocationMutation$data = {
  readonly editTemplateLocation: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type EditTemplateLocationMutation = {
  response: EditTemplateLocationMutation$data;
  variables: EditTemplateLocationMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v3 = {
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
    "name": "EditTemplateLocationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditTemplateLocationPayload",
        "kind": "LinkedField",
        "name": "editTemplateLocation",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
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
    "name": "EditTemplateLocationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EditTemplateLocationPayload",
        "kind": "LinkedField",
        "name": "editTemplateLocation",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "template",
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
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d7fdfa658e148a4be2b25c9b2791c08a",
    "id": null,
    "metadata": {},
    "name": "EditTemplateLocationMutation",
    "operationKind": "mutation",
    "text": "mutation EditTemplateLocationMutation(\n  $input: EditTemplateLocationInput!\n) {\n  editTemplateLocation(input: $input) {\n    template {\n      entityId\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "f11bab8a79760b0869c02990d7172ea2";

export default node;
