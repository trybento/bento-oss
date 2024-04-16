/**
 * @generated SignedSource<<071d1ba952d2ab799863c2a278fa9c3f>>
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
export type EditTag_taggedElement$data = {
  readonly alignment: ContextualTagAlignmentEnumType;
  readonly elementHtml: string | null;
  readonly elementSelector: string;
  readonly elementText: string | null;
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
  readonly " $fragmentType": "EditTag_taggedElement";
};
export type EditTag_taggedElement$key = {
  readonly " $data"?: EditTag_taggedElement$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditTag_taggedElement">;
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
  "name": "EditTag_taggedElement",
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
      "name": "elementText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elementHtml",
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
  "type": "StepPrototypeTaggedElement",
  "abstractKey": null
};
})();

(node as any).hash = "195a9364e2fe64854f548f8b446b3e6b";

export default node;
