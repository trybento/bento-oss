/**
 * @generated SignedSource<<0689f58e78a6d2146dbfb5658b8f236b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type MediaTypeEnumType = "image" | "number_attribute" | "video";
import { FragmentRefs } from "relay-runtime";
export type Media_stepMedia$data = {
  readonly entityId: any;
  readonly media: {
    readonly meta: {
      readonly naturalHeight?: number | null;
      readonly naturalWidth?: number | null;
      readonly videoId?: string | null;
      readonly videoType?: string | null;
    };
    readonly type: MediaTypeEnumType;
    readonly url: string;
  };
  readonly settings: {
    readonly alignment?: string | null;
    readonly fill?: string | null;
    readonly hyperlink?: string | null;
    readonly lightboxDisabled?: boolean | null;
    readonly playsInline?: boolean | null;
  };
  readonly " $fragmentType": "Media_stepMedia";
};
export type Media_stepMedia$key = {
  readonly " $data"?: Media_stepMedia$data;
  readonly " $fragmentSpreads": FragmentRefs<"Media_stepMedia">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Media_stepMedia",
  "selections": [
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
      "concreteType": "Media",
      "kind": "LinkedField",
      "name": "media",
      "plural": false,
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
          "name": "url",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "meta",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "naturalWidth",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "naturalHeight",
                  "storageKey": null
                }
              ],
              "type": "ImageMediaMeta",
              "abstractKey": null
            },
            {
              "kind": "InlineFragment",
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "videoId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "videoType",
                  "storageKey": null
                }
              ],
              "type": "VideoMediaMeta",
              "abstractKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "settings",
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
              "name": "fill",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hyperlink",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "lightboxDisabled",
              "storageKey": null
            }
          ],
          "type": "ImageMediaReferenceSettings",
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
              "name": "playsInline",
              "storageKey": null
            }
          ],
          "type": "VideoMediaReferenceSettings",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MediaReference",
  "abstractKey": null
};
})();

(node as any).hash = "8e59091c7301208d57832b2403bbd106";

export default node;
