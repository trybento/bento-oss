/**
 * @generated SignedSource<<8678a17c1c4c4b81696dd33d63d10615>>
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
export type Cta_guideBaseStepCta$data = {
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
  readonly " $fragmentType": "Cta_guideBaseStepCta";
};
export type Cta_guideBaseStepCta$key = {
  readonly " $data"?: Cta_guideBaseStepCta$data;
  readonly " $fragmentSpreads": FragmentRefs<"Cta_guideBaseStepCta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Cta_guideBaseStepCta",
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
  "type": "GuideBaseStepCta",
  "abstractKey": null
};

(node as any).hash = "ba1eaf18d1888ec5a4e04b87e016f197";

export default node;
