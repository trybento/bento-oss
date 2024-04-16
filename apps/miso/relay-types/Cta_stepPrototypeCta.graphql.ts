/**
 * @generated SignedSource<<f23d7a3e64dc1a50d91deb363491fe40>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type StepCtaStyleEnumType = "link" | "outline" | "solid";
export type StepCtaTypeEnumType = "back" | "complete" | "event" | "launch" | "next" | "save" | "skip" | "url" | "url_complete";
import { FragmentRefs } from "relay-runtime";
export type Cta_stepPrototypeCta$data = {
  readonly destinationGuide: string | null;
  readonly entityId: any;
  readonly settings: {
    readonly bgColorField: string;
    readonly eventName: string | null;
    readonly implicit: boolean | null;
    readonly markComplete: boolean | null;
    readonly opensInNewTab: boolean | null;
    readonly textColorField: string;
  } | null;
  readonly style: StepCtaStyleEnumType;
  readonly text: string;
  readonly type: StepCtaTypeEnumType;
  readonly url: string | null;
  readonly " $fragmentType": "Cta_stepPrototypeCta";
};
export type Cta_stepPrototypeCta$key = {
  readonly " $data"?: Cta_stepPrototypeCta$data;
  readonly " $fragmentSpreads": FragmentRefs<"Cta_stepPrototypeCta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Cta_stepPrototypeCta",
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
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "style",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "text",
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
      "concreteType": "StepCtaSettingsType",
      "kind": "LinkedField",
      "name": "settings",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "bgColorField",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "textColorField",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "eventName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "markComplete",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "implicit",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "opensInNewTab",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "destinationGuide",
      "storageKey": null
    }
  ],
  "type": "StepPrototypeCta",
  "abstractKey": null
};

(node as any).hash = "1ee340ec9969b3ecd236fb203ac17d5f";

export default node;
