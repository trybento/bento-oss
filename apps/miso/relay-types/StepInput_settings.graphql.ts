/**
 * @generated SignedSource<<83dd2e9fcf0fba545720f11eb355ebd4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type DropdownInputVariationEnumType = "cards" | "dropdown";
import { FragmentRefs } from "relay-runtime";
export type StepInput_settings$data = {
  readonly helperText?: string | null;
  readonly maxLabel?: string | null;
  readonly maxValue?: number | null;
  readonly minLabel?: string | null;
  readonly minValue?: number | null;
  readonly multiSelect?: boolean;
  readonly options?: ReadonlyArray<{
    readonly label: string | null;
    readonly value: string | null;
  }>;
  readonly placeholder?: string | null;
  readonly required?: boolean;
  readonly variation?: DropdownInputVariationEnumType;
  readonly " $fragmentType": "StepInput_settings";
};
export type StepInput_settings$key = {
  readonly " $data"?: StepInput_settings$data;
  readonly " $fragmentSpreads": FragmentRefs<"StepInput_settings">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StepInput_settings",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "placeholder",
          "storageKey": null
        },
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/)
      ],
      "type": "TextOrEmailSettings",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "type": "NpsSettings",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "minLabel",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "minValue",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "maxLabel",
          "storageKey": null
        },
        (v2/*: any*/)
      ],
      "type": "NumberPollSettings",
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
          "name": "multiSelect",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "variation",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "DropdownInputOption",
          "kind": "LinkedField",
          "name": "options",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "label",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "value",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "type": "DropdownSettings",
      "abstractKey": null
    }
  ],
  "type": "InputSettings",
  "abstractKey": "__isInputSettings"
};
})();

(node as any).hash = "3638845166d9dc3d4ff1b7adf804dd37";

export default node;
