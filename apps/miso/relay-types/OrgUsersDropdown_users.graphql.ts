/**
 * @generated SignedSource<<18c685f134bf03bbd95d866657277e91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrgUsersDropdown_users$data = ReadonlyArray<{
  readonly avatarUrl: string | null;
  readonly email: string;
  readonly entityId: any;
  readonly fullName: string | null;
  readonly " $fragmentType": "OrgUsersDropdown_users";
}>;
export type OrgUsersDropdown_users$key = ReadonlyArray<{
  readonly " $data"?: OrgUsersDropdown_users$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrgUsersDropdown_users">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "OrgUsersDropdown_users",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fullName",
      "storageKey": null
    },
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
      "name": "avatarUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "01b542c75680cb3973a242a2c755d8f5";

export default node;
