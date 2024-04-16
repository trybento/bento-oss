/**
 * @generated SignedSource<<017eb0fbf9e5e8abfa086f2c630bffe4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeValueTypeEnumType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type TargetRuleTypeEnumType = "all" | "any" | "c" | "empty" | "eq" | "gt" | "gte" | "lt" | "lte" | "nc" | "ne" | "none" | "notEmpty" | "only" | "re" | "rlt" | "rmt";
export type TargetTypeEnumType = "all" | "attribute_rules" | "role";
export type TemplateState = "draft" | "live" | "removed" | "stopped";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
export type AudienceQuery$variables = {
  audienceEntityId: any;
};
export type AudienceQuery$data = {
  readonly audience: {
    readonly entityId: any;
    readonly name: string;
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
    readonly templates: ReadonlyArray<{
      readonly designType: GuideDesignTypeEnumType;
      readonly entityId: any;
      readonly formFactor: GuideFormFactorEnumType | null;
      readonly isCyoa: boolean;
      readonly name: string | null;
      readonly privateName: string | null;
      readonly state: TemplateState;
      readonly theme: ThemeType;
      readonly type: GuideTypeEnumType;
    } | null>;
  } | null;
};
export type AudienceQuery = {
  response: AudienceQuery$data;
  variables: AudienceQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "audienceEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "audienceEntityId"
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
  "name": "type",
  "storageKey": null
},
v5 = [
  (v4/*: any*/),
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
v6 = {
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
      "selections": (v5/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TargetType",
      "kind": "LinkedField",
      "name": "accountUser",
      "plural": false,
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "theme",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isCyoa",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AudienceQuery",
    "selections": [
      {
        "alias": "audience",
        "args": (v1/*: any*/),
        "concreteType": "AudienceRule",
        "kind": "LinkedField",
        "name": "findAudience",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v4/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AudienceQuery",
    "selections": [
      {
        "alias": "audience",
        "args": (v1/*: any*/),
        "concreteType": "AudienceRule",
        "kind": "LinkedField",
        "name": "findAudience",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "templates",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v4/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cf434686505758aa8eb007e2327681ce",
    "id": null,
    "metadata": {},
    "name": "AudienceQuery",
    "operationKind": "query",
    "text": "query AudienceQuery(\n  $audienceEntityId: EntityId!\n) {\n  audience: findAudience(entityId: $audienceEntityId) {\n    entityId\n    name\n    targets {\n      account {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n      accountUser {\n        type\n        groups {\n          rules {\n            attribute\n            ruleType\n            valueType\n            value\n          }\n        }\n      }\n    }\n    templates {\n      name\n      entityId\n      privateName\n      formFactor\n      type\n      theme\n      state\n      isCyoa\n      designType\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "dcd15dea7794a36b1f2018afeab94008";

export default node;
