/**
 * @generated SignedSource<<1db08fb737bbfa47d291ed7a5a1b4503>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type ContextualTagAlignmentEnumType = "bottom_left" | "bottom_right" | "center_left" | "center_right" | "top_left" | "top_right";
export type ContextualTagTooltipAlignmentEnumType = "bottom" | "left" | "right" | "top";
export type ContextualTagTypeEnumType = "badge" | "badge_dot" | "badge_icon" | "dot" | "highlight" | "icon";
export type VisualTagHighlightType = "halo" | "none" | "overlay" | "solid";
import { FragmentRefs } from "relay-runtime";
export type EditTag_taggedElementBase$data = {
  readonly alignment: ContextualTagAlignmentEnumType;
  readonly elementSelector: string;
  readonly entityId: any;
  readonly relativeToText: boolean;
  readonly style: {
    readonly color?: string | null;
    readonly opacity?: number | null;
    readonly padding?: number | null;
    readonly pulse?: boolean | null;
    readonly radius?: number | null;
    readonly text?: string | null;
    readonly thickness?: number | null;
    readonly type?: VisualTagHighlightType | null;
  } | null;
  readonly tooltipAlignment: ContextualTagTooltipAlignmentEnumType;
  readonly type: ContextualTagTypeEnumType;
  readonly url: string;
  readonly wildcardUrl: string;
  readonly xOffset: number;
  readonly yOffset: number;
  readonly " $fragmentType": "EditTag_taggedElementBase";
};
export type EditTag_taggedElementBase$key = {
  readonly " $data"?: EditTag_taggedElementBase$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditTag_taggedElementBase">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditTag_taggedElementBase",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "entityId",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wildcardUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "alignment",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "xOffset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "yOffset",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "relativeToText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elementSelector",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tooltipAlignment",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "style",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
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
      "storageKey": null
    }
  ],
  "type": "GuideBaseStepTaggedElement",
  "abstractKey": null
};
})();

(node as any).hash = "e223a6da8e7844fc63f60df99ec61d50";

export default node;
