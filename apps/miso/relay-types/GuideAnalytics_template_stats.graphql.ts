/**
 * @generated SignedSource<<84653bca6d0bd9ac348d0bd5003e9bb2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GuideAnalytics_template_stats$data = {
  readonly accountsSeen: number | null;
  readonly averageStepsCompleted: number | null;
  readonly averageStepsCompletedForEngaged: number | null;
  readonly completedAStep: number | null;
  readonly guidesViewed: number | null;
  readonly guidesWithCompletedStep: number | null;
  readonly inputStepAnswersCount: number | null;
  readonly percentCompleted: number | null;
  readonly percentGuidesCompleted: number | null;
  readonly usersAnswered: number | null;
  readonly usersClickedCta: number | null;
  readonly usersDismissed: number | null;
  readonly usersSavedForLater: number | null;
  readonly usersSeenGuide: number | null;
  readonly " $fragmentType": "GuideAnalytics_template_stats";
};
export type GuideAnalytics_template_stats$key = {
  readonly " $data"?: GuideAnalytics_template_stats$data;
  readonly " $fragmentSpreads": FragmentRefs<"GuideAnalytics_template_stats">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GuideAnalytics_template_stats",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersSeenGuide",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedAStep",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "percentCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersDismissed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersClickedCta",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersSavedForLater",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "guidesViewed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "guidesWithCompletedStep",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "percentGuidesCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "averageStepsCompleted",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "averageStepsCompletedForEngaged",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inputStepAnswersCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "usersAnswered",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accountsSeen",
      "storageKey": null
    }
  ],
  "type": "TemplateStats",
  "abstractKey": null
};

(node as any).hash = "86ed6fd5752a3755fe83dc7f5b256893";

export default node;
