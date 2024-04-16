/**
 * @generated SignedSource<<bd677979d91fdeea0aa28602e13135d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
import { FragmentRefs } from "relay-runtime";
export type EditTag_taggedElementStyle$data = {
  readonly color?: string | null;
  readonly opacity?: number | null;
  readonly padding?: number | null;
  readonly pulse?: boolean | null;
  readonly radius?: number | null;
  readonly text?: string | null;
  readonly thickness?: number | null;
  readonly type?: VisualTagHighlightType | null;
  readonly " $fragmentType": "EditTag_taggedElementStyle";
};
export type EditTag_taggedElementStyle$key = {
  readonly " $data"?: EditTag_taggedElementStyle$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditTag_taggedElementStyle">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTag_taggedElementStyle",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
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
          "kind": "ScalarField",
          "name": "pulse",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "color",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "thickness",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "padding",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "radius",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "opacity",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "text",
          "storageKey": null
        }
      ],
      "type": "VisualTagHighlightSettings",
      "abstractKey": null
    }
  ],
  "type": "VisualTagStyleSettings",
  "abstractKey": "__isVisualTagStyleSettings"
};

(node as any).hash = "a8ac6da831c4969c1875c4259b926fd0";

export default node;
