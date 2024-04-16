/**
 * @generated SignedSource<<75266f6b0e4a4eeb9c69987e7eee455c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type GuideBaseState = "active" | "archived" | "draft" | "inactive" | "obsoleted" | "paused";
export type SplitTestStateEnumType = "deleted" | "draft" | "live" | "none" | "stopped";
import { FragmentRefs } from "relay-runtime";
export type GuideBaseOverflowMenuButton_guideBase$data = {
  readonly account: {
    readonly entityId: any;
    readonly name: string;
  };
  readonly createdFromTemplate: {
    readonly entityId: any;
    readonly name: string | null;
  } | null;
  readonly entityId: any;
  readonly isTargetedForSplitTesting: SplitTestStateEnumType;
  readonly name: string | null;
  readonly state: GuideBaseState;
  readonly wasAutoLaunched: boolean;
  readonly " $fragmentType": "GuideBaseOverflowMenuButton_guideBase";
};
export type GuideBaseOverflowMenuButton_guideBase$key = {
  readonly " $data"?: GuideBaseOverflowMenuButton_guideBase$data;
  readonly " $fragmentSpreads": FragmentRefs<"GuideBaseOverflowMenuButton_guideBase">;
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GuideBaseOverflowMenuButton_guideBase",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    (v1/*: any*/),
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isTargetedForSplitTesting",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "wasAutoLaunched",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Template",
      "kind": "LinkedField",
      "name": "createdFromTemplate",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "GuideBase",
  "abstractKey": null
};
})();

(node as any).hash = "97428a910cbfce8062a6b40e7311c711";

export default node;
