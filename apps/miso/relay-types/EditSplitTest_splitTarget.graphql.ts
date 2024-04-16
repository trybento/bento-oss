/**
 * @generated SignedSource<<dc9b478a1e391231ac2973f873a6c086>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type ThemeType = "card" | "carousel" | "mailchimp" | "minimal" | "standard" | "timeline" | "videoGallery";
import { FragmentRefs } from "relay-runtime";
export type EditSplitTest_splitTarget$data = {
  readonly description: string | null;
  readonly designType: GuideDesignTypeEnumType;
  readonly entityId: any;
  readonly formFactor: GuideFormFactorEnumType | null;
  readonly isCyoa: boolean;
  readonly name: string | null;
  readonly privateName: string | null;
  readonly stepsCount: number;
  readonly theme: ThemeType;
  readonly " $fragmentType": "EditSplitTest_splitTarget";
};
export type EditSplitTest_splitTarget$key = {
  readonly " $data"?: EditSplitTest_splitTarget$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditSplitTest_splitTarget">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditSplitTest_splitTarget",
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
      "name": "designType",
      "storageKey": null
    },
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
      "kind": "ScalarField",
      "name": "privateName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isCyoa",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "theme",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "stepsCount",
      "storageKey": null
    }
  ],
  "type": "Template",
  "abstractKey": null
};

(node as any).hash = "640667eb5ce919fcc37223ebf1791d23";

export default node;
