/**
 * @generated SignedSource<<73e2e501a0219136a7b8128b1fe86ad6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
import { FragmentRefs } from "relay-runtime";
export type RankableObjects_templates$data = {
  readonly designType: GuideDesignTypeEnumType;
  readonly entityId: any;
  readonly formFactor: GuideFormFactorEnumType | null;
  readonly isAutoLaunchEnabled: boolean | null;
  readonly isCyoa: boolean;
  readonly launchedAt: any | null;
  readonly name: string | null;
  readonly priorityRanking: number;
  readonly privateName: string | null;
  readonly splitTargets: ReadonlyArray<{
    readonly displayTitle: string | null;
    readonly entityId: any;
    readonly name: string | null;
    readonly privateName: string | null;
  } | null>;
  readonly type: GuideTypeEnumType;
  readonly " $fragmentType": "RankableObjects_templates";
};
export type RankableObjects_templates$key = {
  readonly " $data"?: RankableObjects_templates$data;
  readonly " $fragmentSpreads": FragmentRefs<"RankableObjects_templates">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privateName",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RankableObjects_templates",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
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
      "name": "launchedAt",
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
      "name": "priorityRanking",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAutoLaunchEnabled",
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
      "name": "designType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Template",
      "kind": "LinkedField",
      "name": "splitTargets",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "displayTitle",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Template",
  "abstractKey": null
};
})();

(node as any).hash = "5a35486b8e614875a9bcd063bcc31780";

export default node;
