/**
 * @generated SignedSource<<2fa9a1ba6e47c9a6c205e26904069f2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type BannerPosition = "bottom" | "top";
export type BannerType = "floating" | "inline";
export type CtasOrientation = "inline" | "left" | "right" | "spaceBetween";
export type HorizontalMediaAlignment = "center" | "left" | "right";
export type MediaOrientation = "left" | "right";
export type ModalPosition = "bottom_left" | "bottom_right" | "center" | "top_left" | "top_right";
export type ModalSize = "large" | "medium" | "small";
export type StepBodyOrientation = "horizontal" | "vertical";
export type TooltipShowOn = "page_load" | "tag_hover";
export type TooltipSize = "large" | "medium" | "small";
export type VerticalMediaAlignment = "bottom" | "center" | "top";
export type VerticalMediaOrientation = "bottom" | "top";
import { FragmentRefs } from "relay-runtime";
export type Guide_formFactorStyle$data = {
  readonly advancedPadding?: string | null;
  readonly backgroundColor?: string | null;
  readonly backgroundOverlayColor?: string | null;
  readonly backgroundOverlayOpacity?: number | null;
  readonly bannerPosition?: BannerPosition;
  readonly bannerType?: BannerType;
  readonly borderColor?: string | null;
  readonly borderRadius?: number | null;
  readonly canDismiss?: boolean | null;
  readonly ctasOrientation?: CtasOrientation | null;
  readonly dotsColor?: string | null;
  readonly hasArrow?: boolean;
  readonly hasBackgroundOverlay?: boolean;
  readonly height?: number | null;
  readonly hideCompletedSteps?: boolean | null;
  readonly hideStepGroupTitle?: boolean | null;
  readonly horizontalMediaAlignment?: HorizontalMediaAlignment | null;
  readonly imageWidth?: string | null;
  readonly mediaFontSize?: number | null;
  readonly mediaOrientation?: MediaOrientation | null;
  readonly mediaTextColor?: string | null;
  readonly modalSize?: ModalSize;
  readonly padding?: number | null;
  readonly position?: ModalPosition;
  readonly selectedBackgroundColor?: string | null;
  readonly statusLabelColor?: string | null;
  readonly stepBodyOrientation?: StepBodyOrientation | null;
  readonly textColor?: string | null;
  readonly tooltipShowOn?: TooltipShowOn;
  readonly tooltipSize?: TooltipSize;
  readonly verticalMediaAlignment?: VerticalMediaAlignment | null;
  readonly verticalMediaOrientation?: VerticalMediaOrientation | null;
  readonly " $fragmentType": "Guide_formFactorStyle";
};
export type Guide_formFactorStyle$key = {
  readonly " $data"?: Guide_formFactorStyle$data;
  readonly " $fragmentSpreads": FragmentRefs<"Guide_formFactorStyle">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Guide_formFactorStyle",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "bannerType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "bannerPosition",
          "storageKey": null
        },
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/)
      ],
      "type": "BannerStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "modalSize",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "position",
          "storageKey": null
        },
        (v4/*: any*/),
        (v2/*: any*/),
        (v0/*: any*/),
        (v1/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/),
        (v3/*: any*/),
        (v10/*: any*/),
        (v11/*: any*/),
        (v12/*: any*/)
      ],
      "type": "ModalStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundOverlayColor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "backgroundOverlayOpacity",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hasArrow",
          "storageKey": null
        },
        (v4/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "tooltipShowOn",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "tooltipSize",
          "storageKey": null
        },
        (v2/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/),
        (v3/*: any*/),
        (v10/*: any*/),
        (v11/*: any*/),
        (v12/*: any*/)
      ],
      "type": "TooltipStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/),
        (v9/*: any*/),
        (v13/*: any*/),
        (v10/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/),
        (v16/*: any*/),
        (v17/*: any*/),
        (v3/*: any*/),
        (v11/*: any*/),
        (v12/*: any*/)
      ],
      "type": "CardStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v5/*: any*/),
        (v6/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "dotsColor",
          "storageKey": null
        },
        (v13/*: any*/),
        (v10/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/),
        (v16/*: any*/),
        (v17/*: any*/),
        (v3/*: any*/)
      ],
      "type": "CarouselStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/),
        (v16/*: any*/),
        (v17/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "selectedBackgroundColor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "statusLabelColor",
          "storageKey": null
        }
      ],
      "type": "VideoGalleryStyle",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v5/*: any*/),
        (v6/*: any*/),
        (v13/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hideStepGroupTitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hideCompletedSteps",
          "storageKey": null
        },
        (v10/*: any*/),
        (v3/*: any*/)
      ],
      "type": "ChecklistStyle",
      "abstractKey": null
    }
  ],
  "type": "FormFactorStyle",
  "abstractKey": "__isFormFactorStyle"
};
})();

(node as any).hash = "74e678079cc8eeaf8d6ccb4c478bba3c";

export default node;
