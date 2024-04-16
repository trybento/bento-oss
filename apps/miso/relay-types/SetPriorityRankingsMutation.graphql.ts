/**
 * @generated SignedSource<<e20b1f1f9552eccc13a146cad0e241a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RankableObjectTypeType = "guide" | "survey";
export type SetPriorityRankingsInput = {
  targets: ReadonlyArray<RankableObjectInputType>;
};
export type RankableObjectInputType = {
  entityId: any;
  priorityRanking: number;
  type: RankableObjectTypeType;
};
export type SetPriorityRankingsMutation$variables = {
  input: SetPriorityRankingsInput;
};
export type SetPriorityRankingsMutation$data = {
  readonly setPriorityRankings: {
    readonly targets: ReadonlyArray<{
      readonly entityId: any;
      readonly priorityRanking: number;
      readonly type: RankableObjectTypeType;
    }>;
  } | null;
};
export type SetPriorityRankingsMutation = {
  response: SetPriorityRankingsMutation$data;
  variables: SetPriorityRankingsMutation$variables;
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
    "concreteType": "SetPriorityRankingsPayload",
    "kind": "LinkedField",
    "name": "setPriorityRankings",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RankableObjectType",
        "kind": "LinkedField",
        "name": "targets",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "entityId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "priorityRanking",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetPriorityRankingsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetPriorityRankingsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bbc2146745e08b73584aa47dcf5f0aa0",
    "id": null,
    "metadata": {},
    "name": "SetPriorityRankingsMutation",
    "operationKind": "mutation",
    "text": "mutation SetPriorityRankingsMutation(\n  $input: SetPriorityRankingsInput!\n) {\n  setPriorityRankings(input: $input) {\n    targets {\n      entityId\n      priorityRanking\n      type\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "828cd9430c3b642048964cf66373c8fe";

export default node;
