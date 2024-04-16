/**
 * @generated SignedSource<<94c2c4d2290796625a573ff16d74fc66>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
import { FragmentRefs } from "relay-runtime";
export type GuideAnalytics_branching_module_stats$data = {
  readonly displayTitle: string | null;
  readonly entityId: any;
  readonly stepPrototypes: ReadonlyArray<{
    readonly name: string;
    readonly stepCompletionStats: {
      readonly stepsCompleted: number | null;
      readonly totalSteps: number | null;
    };
    readonly stepType: StepTypeEnum;
  }>;
  readonly " $fragmentType": "GuideAnalytics_branching_module_stats";
};
export type GuideAnalytics_branching_module_stats$key = {
  readonly " $data"?: GuideAnalytics_branching_module_stats$data;
  readonly " $fragmentSpreads": FragmentRefs<"GuideAnalytics_branching_module_stats">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GuideAnalytics_branching_module_stats",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayTitle",
      "storageKey": null
    },
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
      "concreteType": "StepPrototype",
      "kind": "LinkedField",
      "name": "stepPrototypes",
      "plural": true,
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
          "name": "stepType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "StepCompletionStatsType",
          "kind": "LinkedField",
          "name": "stepCompletionStats",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "stepsCompleted",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalSteps",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Module",
  "abstractKey": null
};

(node as any).hash = "148d9148fccf26ec2da78cd0c5d4cfa3";

export default node;
