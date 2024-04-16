/**
 * @generated SignedSource<<20856940f56279ccd750a2c1b62e0bb7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditUserGuideBase_organization$data = {
  readonly name: string;
  readonly users: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"OrgUsersDropdown_users">;
  }>;
  readonly " $fragmentType": "EditUserGuideBase_organization";
};
export type EditUserGuideBase_organization$key = {
  readonly " $data"?: EditUserGuideBase_organization$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditUserGuideBase_organization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditUserGuideBase_organization",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "users",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "OrgUsersDropdown_users"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "a97ba64e2cb3ba5a594bcd74d4803879";

export default node;
