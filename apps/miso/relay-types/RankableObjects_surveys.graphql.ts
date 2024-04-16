/**
 * @generated SignedSource<<7dc435ee67d3d7bbe05c586f9999ffa9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type NpsStartingTypeEnumType = "date_based" | "manual";
import { FragmentRefs } from "relay-runtime";
export type RankableObjects_surveys$data = {
  readonly entityId: any;
  readonly launchedAt: any | null;
  readonly name: string;
  readonly priorityRanking: number;
  readonly startingType: NpsStartingTypeEnumType;
  readonly " $fragmentType": "RankableObjects_surveys";
};
export type RankableObjects_surveys$key = {
  readonly " $data"?: RankableObjects_surveys$data;
  readonly " $fragmentSpreads": FragmentRefs<"RankableObjects_surveys">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RankableObjects_surveys",
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "launchedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startingType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "priorityRanking",
      "storageKey": null
    }
  ],
  "type": "NpsSurvey",
  "abstractKey": null
};

(node as any).hash = "f3fa0f5df8cc7158a65b1cc711ace347";

export default node;
