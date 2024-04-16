/**
 * @generated SignedSource<<2b9b2a7b9e1338eaaf2b1045326c67e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
import { FragmentRefs } from "relay-runtime";
export type TemplateOption_template$data = {
  readonly description: string | null;
  readonly formFactor: GuideFormFactorEnumType | null;
  readonly name: string | null;
  readonly " $fragmentType": "TemplateOption_template";
};
export type TemplateOption_template$key = {
  readonly " $data"?: TemplateOption_template$data;
  readonly " $fragmentSpreads": FragmentRefs<"TemplateOption_template">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TemplateOption_template",
  "selections": [
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
      "name": "formFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Template",
  "abstractKey": null
};

(node as any).hash = "d710606c53464eb22f30a5e8219084c1";

export default node;
