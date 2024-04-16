/**
 * @generated SignedSource<<b5c918817e56a4d8e9e31b02864b4963>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Guide_notificationSettings$data = {
  readonly action: boolean | null;
  readonly branching: boolean | null;
  readonly disable: boolean | null;
  readonly info: boolean | null;
  readonly input: boolean | null;
  readonly " $fragmentType": "Guide_notificationSettings";
};
export type Guide_notificationSettings$key = {
  readonly " $data"?: Guide_notificationSettings$data;
  readonly " $fragmentSpreads": FragmentRefs<"Guide_notificationSettings">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Guide_notificationSettings",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "disable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "branching",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "input",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "action",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "info",
      "storageKey": null
    }
  ],
  "type": "TemplateNotificationSettings",
  "abstractKey": null
};

(node as any).hash = "c1359d7d51ba419af2523fcebc4cfa0a";

export default node;
