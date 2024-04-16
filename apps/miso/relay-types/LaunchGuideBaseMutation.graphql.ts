/**
 * @generated SignedSource<<c7e0a84b903ddc6591a419818caf9a62>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type LaunchGuideBaseInput = {
  guideBaseEntityId: any;
};
export type LaunchGuideBaseMutation$variables = {
  input: LaunchGuideBaseInput;
};
export type LaunchGuideBaseMutation$data = {
  readonly launchGuideBase: {
    readonly guideBase: {
      readonly accountGuide: {
        readonly entityId: any;
      } | null;
      readonly createdFromTemplate: {
        readonly entityId: any;
      } | null;
      readonly entityId: any;
      readonly type: GuideTypeEnumType;
    } | null;
  } | null;
};
export type LaunchGuideBaseMutation = {
  response: LaunchGuideBaseMutation$data;
  variables: LaunchGuideBaseMutation$variables;
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
  "name": "type",
  "storageKey": null
},
v4 = [
  (v2/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  (v5/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LaunchGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LaunchGuideBasePayload",
        "kind": "LinkedField",
        "name": "launchGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Guide",
                "kind": "LinkedField",
                "name": "accountGuide",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
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
    "name": "LaunchGuideBaseMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LaunchGuideBasePayload",
        "kind": "LinkedField",
        "name": "launchGuideBase",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideBase",
            "kind": "LinkedField",
            "name": "guideBase",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Template",
                "kind": "LinkedField",
                "name": "createdFromTemplate",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Guide",
                "kind": "LinkedField",
                "name": "accountGuide",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "080265b022b2792c42250ca6349efdd1",
    "id": null,
    "metadata": {},
    "name": "LaunchGuideBaseMutation",
    "operationKind": "mutation",
    "text": "mutation LaunchGuideBaseMutation(\n  $input: LaunchGuideBaseInput!\n) {\n  launchGuideBase(input: $input) {\n    guideBase {\n      entityId\n      type\n      createdFromTemplate {\n        entityId\n        id\n      }\n      accountGuide {\n        entityId\n        id\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b4c3f253543bd117a277a89f1f026a1d";

export default node;
