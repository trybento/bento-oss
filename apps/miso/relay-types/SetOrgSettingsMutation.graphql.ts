/**
 * @generated SignedSource<<c1de7ce5727963b6d0f05afd98b00411>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SetOrgSettingsInput = {
  defaultUserNotificationURL?: string | null;
  fallbackCommentsEmail?: string | null;
  orgName?: string | null;
  sendAccountUserNudges?: boolean | null;
  sendEmailNotifications?: boolean | null;
};
export type SetOrgSettingsMutation$variables = {
  input: SetOrgSettingsInput;
};
export type SetOrgSettingsMutation$data = {
  readonly setOrgSettings: {
    readonly orgSettings: {
      readonly defaultUserNotificationURL: string | null;
      readonly fallbackCommentsEmail: string | null;
      readonly sendAccountUserNudges: boolean | null;
      readonly sendEmailNotifications: boolean | null;
    } | null;
  } | null;
};
export type SetOrgSettingsMutation = {
  response: SetOrgSettingsMutation$data;
  variables: SetOrgSettingsMutation$variables;
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
    "concreteType": "SetOrgSettingsPayload",
    "kind": "LinkedField",
    "name": "setOrgSettings",
    "plural": false,
    "selections": [
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
            "kind": "ScalarField",
            "name": "defaultUserNotificationURL",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sendAccountUserNudges",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sendEmailNotifications",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fallbackCommentsEmail",
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
    "name": "SetOrgSettingsMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SetOrgSettingsMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8320a2c422b5e633690e157061543ba6",
    "id": null,
    "metadata": {},
    "name": "SetOrgSettingsMutation",
    "operationKind": "mutation",
    "text": "mutation SetOrgSettingsMutation(\n  $input: SetOrgSettingsInput!\n) {\n  setOrgSettings(input: $input) {\n    orgSettings {\n      defaultUserNotificationURL\n      sendAccountUserNudges\n      sendEmailNotifications\n      fallbackCommentsEmail\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a1ce51e4e107c5563ff8a86df202d5f1";

export default node;
