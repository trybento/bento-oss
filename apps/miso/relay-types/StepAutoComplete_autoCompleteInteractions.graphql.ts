/**
 * @generated SignedSource<<392f984e5dfab4001ed8c780f77fb7ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type AutoCompleteInteractionType = "guide_completion";
import { FragmentRefs } from "relay-runtime";
export type StepAutoComplete_autoCompleteInteractions$data = {
  readonly interactionType?: AutoCompleteInteractionType | null;
  readonly templateEntityId?: string;
  readonly " $fragmentType": "StepAutoComplete_autoCompleteInteractions";
};
export type StepAutoComplete_autoCompleteInteractions$key = {
  readonly " $data"?: StepAutoComplete_autoCompleteInteractions$data;
  readonly " $fragmentSpreads": FragmentRefs<"StepAutoComplete_autoCompleteInteractions">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "StepAutoComplete_autoCompleteInteractions",
  "selections": [
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "interactionType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "templateEntityId",
          "storageKey": null
        }
      ],
      "type": "OnGuideCompletion",
      "abstractKey": null
    }
  ],
  "type": "AutoCompleteInteraction",
  "abstractKey": "__isAutoCompleteInteraction"
};

(node as any).hash = "3c89de0058641b07e5e6aa114d7b7819";

export default node;
