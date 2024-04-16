/**
 * @generated SignedSource<<be7015798992ea19a40f8f2fb37646d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type BranchingQuestionsQuery$variables = {};
export type BranchingQuestionsQuery$data = {
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
};
export type BranchingQuestionsQuery = {
  response: BranchingQuestionsQuery$data;
  variables: BranchingQuestionsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Organization",
    "kind": "LinkedField",
    "name": "organization",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "BranchingQuestion",
        "kind": "LinkedField",
        "name": "branchingQuestions",
        "plural": true,
        "selections": [
          (v0/*: any*/),
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
              (v0/*: any*/),
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BranchingQuestionsQuery",
    "selections": (v1/*: any*/),
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BranchingQuestionsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9d46dee457671de6dfd7da4f1a3e5412",
    "id": null,
    "metadata": {},
    "name": "BranchingQuestionsQuery",
    "operationKind": "query",
    "text": "query BranchingQuestionsQuery {\n  organization {\n    id\n    branchingQuestions {\n      id\n      question\n      branchingKey\n      choices {\n        id\n        choiceKey\n        label\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3b3d26cd552f85fcfe4cbcb5aa7babb";

export default node;
