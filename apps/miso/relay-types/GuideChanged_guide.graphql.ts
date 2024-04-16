/**
 * @generated SignedSource<<7cedc09c6d49c36dc2bb294dcb3dd937>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type GuideState = "active" | "draft" | "expired" | "inactive";
export type GuideTypeEnumType = "account" | "split_test" | "template" | "user";
export type StepCompletedBy = "accountUser" | "auto" | "user";
export type StepTypeEnum = "branching" | "branching_optional" | "fyi" | "input" | "optional" | "required";
import { FragmentRefs } from "relay-runtime";
export type GuideChanged_guide$data = {
  readonly account: {
    readonly attributes: any;
    readonly entityId: any;
    readonly name: string;
    readonly primaryContact: {
      readonly entityId: any;
    } | null;
  };
  readonly createdFromTemplate: {
    readonly entityId: any;
    readonly name: string | null;
  } | null;
  readonly entityId: any;
  readonly guideModules: ReadonlyArray<{
    readonly createdFromModule: {
      readonly entityId: any;
    } | null;
    readonly entityId: any;
    readonly name: string;
    readonly orderIndex: number;
    readonly steps: ReadonlyArray<{
      readonly body: string | null;
      readonly bodySlate: any | null;
      readonly completedAt: any | null;
      readonly completedByAccountUser: {
        readonly email: string | null;
        readonly fullName: string | null;
      } | null;
      readonly completedByType: StepCompletedBy | null;
      readonly completedByUser: {
        readonly email: string;
        readonly fullName: string | null;
      } | null;
      readonly createdFromStepPrototype: {
        readonly entityId: any;
      };
      readonly entityId: any;
      readonly isAutoCompletable: boolean;
      readonly name: string;
      readonly orderIndex: number;
      readonly stepType: StepTypeEnum;
      readonly usersViewed: ReadonlyArray<{
        readonly email: string | null;
        readonly fullName: string | null;
      }>;
    }>;
  }>;
  readonly name: string;
  readonly state: GuideState;
  readonly type: GuideTypeEnumType;
  readonly " $fragmentType": "GuideChanged_guide";
};
export type GuideChanged_guide$key = {
  readonly " $data"?: GuideChanged_guide$data;
  readonly " $fragmentSpreads": FragmentRefs<"GuideChanged_guide">;
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
v2 = [
  (v0/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fullName",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "email",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GuideChanged_guide",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
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
      "name": "type",
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
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "attributes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "User",
          "kind": "LinkedField",
          "name": "primaryContact",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "GuideModule",
      "kind": "LinkedField",
      "name": "guideModules",
      "plural": true,
      "selections": [
        (v1/*: any*/),
        (v0/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Module",
          "kind": "LinkedField",
          "name": "createdFromModule",
          "plural": false,
          "selections": (v2/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Step",
          "kind": "LinkedField",
          "name": "steps",
          "plural": true,
          "selections": [
            (v1/*: any*/),
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "body",
              "storageKey": null
            },
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "completedAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "completedByType",
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
              "concreteType": "AccountUser",
              "kind": "LinkedField",
              "name": "usersViewed",
              "plural": true,
              "selections": (v4/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "User",
              "kind": "LinkedField",
              "name": "completedByUser",
              "plural": false,
              "selections": (v4/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AccountUser",
              "kind": "LinkedField",
              "name": "completedByAccountUser",
              "plural": false,
              "selections": (v4/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "bodySlate",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAutoCompletable",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "StepPrototype",
              "kind": "LinkedField",
              "name": "createdFromStepPrototype",
              "plural": false,
              "selections": (v2/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Guide",
  "abstractKey": null
};
})();

(node as any).hash = "33a993c1d7faf865919c7fa63531e07d";

export default node;
