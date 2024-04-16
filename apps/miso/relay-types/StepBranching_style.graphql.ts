/**
 * @generated SignedSource<<ddf9d6e0c30069cc9d3b288f2b0f76ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type CYOABackgroundImagePosition = "background" | "bottom" | "left" | "right" | "top";
import { FragmentRefs } from "relay-runtime";
export type StepBranching_style$data = {
  readonly backgroundImagePosition?: CYOABackgroundImagePosition;
  readonly backgroundImageUrl?: string | null;
  readonly " $fragmentType": "StepBranching_style";
};
export type StepBranching_style$key = {
  readonly " $data"?: StepBranching_style$data;
  readonly " $fragmentSpreads": FragmentRefs<"StepBranching_style">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StepBranching_style",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundImageUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundImagePosition",
          "storageKey": null
        }
      ],
      "type": "BranchingCardStyle",
      "abstractKey": null
    }
  ],
  "type": "BranchingStyle",
  "abstractKey": "__isBranchingStyle"
};

(node as any).hash = "84b9e416626cfa2d8fa3fdb534f134d3";

export default node;
