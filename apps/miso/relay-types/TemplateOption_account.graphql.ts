/**
 * @generated SignedSource<<fe39c5a530c0290573f5ff68db95e4f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TemplateOption_account$data = {
  readonly name: string;
  readonly " $fragmentType": "TemplateOption_account";
};
export type TemplateOption_account$key = {
  readonly " $data"?: TemplateOption_account$data;
  readonly " $fragmentSpreads": FragmentRefs<"TemplateOption_account">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TemplateOption_account",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "1bba3c9028b54bd8e418c6afdd830155";

export default node;
