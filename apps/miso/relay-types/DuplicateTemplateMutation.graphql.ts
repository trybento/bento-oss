/**
 * @generated SignedSource<<c29a37706ce96d89195156910ae1382b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type DuplicateTemplateInput = {
  duplicateStepGroups?: boolean | null;
  entityId: any;
  name?: string | null;
  theme?: ThemeType | null;
  type?: GuideTypeEnumType | null;
};
export type DuplicateTemplateMutation$variables = {
  input: DuplicateTemplateInput;
};
export type DuplicateTemplateMutation$data = {
  readonly duplicateTemplate: {
    readonly errors: ReadonlyArray<string> | null;
    readonly template: {
      readonly entityId: any;
    } | null;
  } | null;
};
export type DuplicateTemplateMutation = {
  response: DuplicateTemplateMutation$data;
  variables: DuplicateTemplateMutation$variables;
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
    "name": "DuplicateTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateTemplatePayload",
        "kind": "LinkedField",
        "name": "duplicateTemplate",
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
    "name": "DuplicateTemplateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DuplicateTemplatePayload",
        "kind": "LinkedField",
        "name": "duplicateTemplate",
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
    "cacheID": "c523baa3248b91950937eb484970eda8",
    "id": null,
    "metadata": {},
    "name": "DuplicateTemplateMutation",
    "operationKind": "mutation",
    "text": "mutation DuplicateTemplateMutation(\n  $input: DuplicateTemplateInput!\n) {\n  duplicateTemplate(input: $input) {\n    template {\n      entityId\n      id\n    }\n    errors\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f8401da70030b3cb2e2e77a77a5ebe2";

export default node;
