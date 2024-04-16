/**
 * @generated SignedSource<<3cdae1ff4e4b6d5e86deb5ae18e6647f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AudienceRulesDisplayQuery$variables = {
  templateEntityIds?: ReadonlyArray<any> | null;
};
export type AudienceRulesDisplayQuery$data = {
  readonly organization: {
    readonly branchingQuestions: ReadonlyArray<{
      readonly branchingKey: string;
      readonly choices: ReadonlyArray<{
        readonly choiceKey: string;
        readonly id: string;
        readonly label: string;
      }>;
      readonly id: string;
      readonly question: string;
    }>;
    readonly id: string;
  };
  readonly templates: ReadonlyArray<{
    readonly entityId: any;
    readonly name: string | null;
  }> | null;
};
export type AudienceRulesDisplayQuery = {
  response: AudienceRulesDisplayQuery$data;
  variables: AudienceRulesDisplayQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityIds"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityIds",
    "variableName": "templateEntityIds"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Organization",
  "kind": "LinkedField",
  "name": "organization",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "BranchingQuestion",
      "kind": "LinkedField",
      "name": "branchingQuestions",
      "plural": true,
      "selections": [
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "question",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "branchingKey",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "BranchingQuestionChoice",
          "kind": "LinkedField",
          "name": "choices",
          "plural": true,
          "selections": [
            (v4/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "choiceKey",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "label",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AudienceRulesDisplayQuery",
    "selections": [
      {
        "alias": "templates",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      (v5/*: any*/)
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AudienceRulesDisplayQuery",
    "selections": [
      {
        "alias": "templates",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      (v5/*: any*/)
    ]
  },
  "params": {
    "cacheID": "1577afdb5d6db6fa55c90093c4db43f0",
    "id": null,
    "metadata": {},
    "name": "AudienceRulesDisplayQuery",
    "operationKind": "query",
    "text": "query AudienceRulesDisplayQuery(\n  $templateEntityIds: [EntityId!]\n) {\n  templates: findTemplates(entityIds: $templateEntityIds) {\n    entityId\n    name\n    id\n  }\n  organization {\n    id\n    branchingQuestions {\n      id\n      question\n      branchingKey\n      choices {\n        id\n        choiceKey\n        label\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5fe0a64ced868d1edb3875e85d86bf25";

export default node;
