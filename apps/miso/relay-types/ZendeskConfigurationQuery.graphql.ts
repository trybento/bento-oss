/**
 * @generated SignedSource<<19444a59678058fb027820705c0087c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AttributeType = "account" | "account_user";
export type AttributeValueType = "audience" | "boolean" | "branchingPath" | "date" | "number" | "stringArray" | "template" | "text";
export type IntegrationStateEnum = "active" | "inactive";
export type IntegrationTypeEnum = "zendesk";
export type ZendeskConfigurationQuery$variables = {};
export type ZendeskConfigurationQuery$data = {
  readonly attributes: ReadonlyArray<{
    readonly name: string;
    readonly type: AttributeType | null;
    readonly valueType: AttributeValueType;
  }>;
  readonly orgSettings: {
    readonly integrationApiKeys: ReadonlyArray<{
      readonly entityId: any;
      readonly key: string;
      readonly state: IntegrationStateEnum;
      readonly type: IntegrationTypeEnum | null;
      readonly zendeskState: {
        readonly subdomain: string | null;
        readonly username: string | null;
      } | null;
    }> | null;
  } | null;
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
export type ZendeskConfigurationQuery = {
  response: ZendeskConfigurationQuery$data;
  variables: ZendeskConfigurationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
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
  "name": "valueType",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Organization",
  "kind": "LinkedField",
  "name": "organization",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "BranchingQuestion",
      "kind": "LinkedField",
      "name": "branchingQuestions",
      "plural": true,
      "selections": [
        (v3/*: any*/),
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
            (v3/*: any*/),
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
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "ZendeskState",
  "kind": "LinkedField",
  "name": "zendeskState",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "username",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "subdomain",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ZendeskConfigurationQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integrationApiKeys",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v0/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ZendeskConfigurationQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Attribute",
        "kind": "LinkedField",
        "name": "attributes",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationOrgSettings",
        "kind": "LinkedField",
        "name": "orgSettings",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "IntegrationApiKey",
            "kind": "LinkedField",
            "name": "integrationApiKeys",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v0/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "094ee383ccea1c303ce5fa9f05af793e",
    "id": null,
    "metadata": {},
    "name": "ZendeskConfigurationQuery",
    "operationKind": "query",
    "text": "query ZendeskConfigurationQuery {\n  attributes {\n    type\n    name\n    valueType\n    id\n  }\n  organization {\n    id\n    branchingQuestions {\n      id\n      question\n      branchingKey\n      choices {\n        id\n        choiceKey\n        label\n      }\n    }\n  }\n  orgSettings {\n    integrationApiKeys {\n      entityId\n      type\n      state\n      key\n      zendeskState {\n        username\n        subdomain\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "036a6f32fa3b8bca787a81853447c9de";

export default node;
