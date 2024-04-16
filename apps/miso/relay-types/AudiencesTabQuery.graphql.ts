/**
 * @generated SignedSource<<1d7b0a57c9bcb1988aabdf6bb5e413d9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type AudienceStateType = "active" | "inactive";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type AudiencesTabQuery$variables = {};
export type AudiencesTabQuery$data = {
  readonly audiences: ReadonlyArray<{
    readonly editedAt: any | null;
    readonly editedBy: {
      readonly email: string;
      readonly fullName: string | null;
    } | null;
    readonly entityId: any;
    readonly name: string;
    readonly state: AudienceStateType | null;
    readonly targets: {
      readonly account: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
      readonly accountUser: {
        readonly groups: ReadonlyArray<{
          readonly rules: ReadonlyArray<{
            readonly attribute: string;
            readonly ruleType: TargetRuleTypeEnumType;
            readonly value: any;
            readonly valueType: AttributeValueTypeEnumType;
          }>;
        }> | null;
        readonly type: TargetTypeEnumType;
      };
    } | null;
  } | null> | null;
};
export type AudiencesTabQuery = {
  response: AudiencesTabQuery$data;
  variables: AudiencesTabQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editedAt",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "type",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "TargetGroupType",
    "kind": "LinkedField",
    "name": "groups",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetRuleType",
        "kind": "LinkedField",
        "name": "rules",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "attribute",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ruleType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "valueType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "value",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "TargetsType",
  "kind": "LinkedField",
  "name": "targets",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": (v6/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v6/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AudiencesTabQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AudienceRule",
        "kind": "LinkedField",
        "name": "audiences",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "editedBy",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AudiencesTabQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AudienceRule",
        "kind": "LinkedField",
        "name": "audiences",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "editedBy",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4a824898064d40627a44342e9eedc7b7",
    "id": null,
    "metadata": {},
    "name": "AudiencesTabQuery",
    "operationKind": "query",
    "text": "query AudiencesTabQuery {\n  audiences {\n    entityId\n    name\n    editedAt\n    state\n    editedBy {\n      fullName\n      email\n      id\n    }\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "41416c9a1a65ec24d7877937bf1161ac";

export default node;
